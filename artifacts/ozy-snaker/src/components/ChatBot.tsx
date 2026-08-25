import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const VOICE_KEY = "ozy-voice-on";

function cleanForTTS(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/https?:\/\/\S+/g, "website")
    .replace(/[*#`_~>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirstSentence(buffer: string): { sentence: string; rest: string } | null {
  const idx = buffer.search(/[.!?\n]\s/);
  if (idx === -1) return null;
  const end = idx + 1;
  const sentence = buffer.slice(0, end).trim();
  const rest = buffer.slice(end);
  return { sentence, rest };
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Jai Shree Ram! \u{1F45F} OZY Sneakers mein aapka swagat hai. Main aapki kaise madad kar sakta hoon?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceOn, setVoiceOn] = useState(() => {
    try { return localStorage.getItem(VOICE_KEY) !== "off"; } catch { return true; }
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const voiceBufferRef = useRef("");
  const voiceQueueRef = useRef<string[]>([]);
  const generationRef = useRef(0);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const pumpRunningRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const stopVoice = useCallback(() => {
    generationRef.current++;
    voiceQueueRef.current = [];
    voiceBufferRef.current = "";
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch { /* */ }
      audioSourceRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    pumpRunningRef.current = false;
  }, []);

  const pumpVoice = useCallback(async (gen: number) => {
    if (pumpRunningRef.current) return;
    pumpRunningRef.current = true;

    while (gen === generationRef.current && voiceQueueRef.current.length > 0) {
      const text = voiceQueueRef.current.shift()!;
      const cleaned = cleanForTTS(text);
      if (!cleaned || cleaned.length < 4) continue;

      let retries = 0;
      const maxRetries = 2;
      while (retries <= maxRetries) {
        if (gen !== generationRef.current) break;
        try {
          const res = await fetch(`${BASE}/api/tts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: cleaned }),
          });
          if (!res.ok) {
            retries++;
            if (retries <= maxRetries) {
              await new Promise((r) => setTimeout(r, 1000 * retries));
              continue;
            }
            break;
          }
          const arrayBuffer = await res.arrayBuffer();
          if (gen !== generationRef.current) break;

          const ctx = audioCtxRef.current;
          if (!ctx) break;

          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          if (gen !== generationRef.current) break;

          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          audioSourceRef.current = source;

          await new Promise<void>((resolve) => {
            source.onended = () => {
              audioSourceRef.current = null;
              resolve();
            };
            source.start();
          });
          break;
        } catch (err) {
          retries++;
          if (retries <= maxRetries) {
            await new Promise((r) => setTimeout(r, 1000 * retries));
          }
        }
      }
      if (gen !== generationRef.current) break;
      await new Promise((r) => setTimeout(r, 500));
    }
    pumpRunningRef.current = false;
  }, []);

  const enqueueVoice = useCallback((text: string, gen: number) => {
    if (gen !== generationRef.current) return;
    voiceBufferRef.current += text;
    while (true) {
      const result = extractFirstSentence(voiceBufferRef.current);
      if (!result) break;
      if (result.sentence.length >= 5) {
        voiceQueueRef.current.push(result.sentence);
      }
      voiceBufferRef.current = result.rest;
    }
    if (voiceQueueRef.current.length > 0 && !pumpRunningRef.current) {
      void pumpVoice(gen);
    }
  }, [pumpVoice]);

  const flushVoice = useCallback((gen: number) => {
    const leftover = voiceBufferRef.current.trim();
    voiceBufferRef.current = "";
    if (leftover && leftover.length >= 4 && gen === generationRef.current) {
      voiceQueueRef.current.push(leftover);
    }
    if (voiceQueueRef.current.length > 0 && !pumpRunningRef.current) {
      void pumpVoice(gen);
    }
  }, [pumpVoice]);

  useEffect(() => {
    try { localStorage.setItem(VOICE_KEY, voiceOn ? "on" : "off"); } catch { /* */ }
    if (!voiceOn) stopVoice();
  }, [voiceOn, stopVoice]);

  useEffect(() => () => stopVoice(), [stopVoice]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    stopVoice();
    const gen = ++generationRef.current;

    if (voiceOn) {
      getAudioCtx();
    }

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const res = await fetch(`${BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = JSON.parse(line.slice(6));
          if (json.done) break;
          if (json.error) {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: json.error };
              return updated;
            });
            break;
          }
          if (json.content) {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: updated[updated.length - 1].content + json.content,
              };
              return updated;
            });
            if (voiceOn && gen === generationRef.current) {
              enqueueVoice(json.content, gen);
            }
          }
        }
      }
      if (voiceOn && gen === generationRef.current) {
        flushVoice(gen);
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Network error aayi, dobara try karein.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 left-4 z-50 w-[calc(100vw-2rem)] max-w-sm flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          style={{ background: "#0f0f0f" }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#1a1a1a", borderBottom: "1px solid #2a2a2a" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "#ff5c00" }}>
              O
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold leading-none">OZY Assistant</p>
              <p className="text-xs mt-0.5" style={{ color: "#22c55e" }}>&#x25CF; Online</p>
            </div>
            <button
              onClick={() => setVoiceOn((v) => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer"
              style={{ background: voiceOn ? "rgba(255,92,0,0.15)" : "#2a2a2a" }}
              title={voiceOn ? "Voice ON — click to mute" : "Voice OFF — click to unmute"}
            >
              {voiceOn ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff5c00">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0012 7.97v8.05A4.49 4.49 0 0016.5 12zM12 1v2a9 9 0 010 18v2a11 11 0 000-22z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#666">
                  <path d="M16.5 12A4.5 4.5 0 0012 7.97v2.12l2.95 2.95c.05-.31.05-.63.05-.97zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0021 12a11 11 0 00-8.36-10.64l1.51 1.51A8.9 8.9 0 0119 12zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              )}
            </button>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-lg leading-none cursor-pointer">&#x2715;</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: "320px", minHeight: "200px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="px-3 py-2 rounded-2xl text-sm max-w-[85%] leading-relaxed whitespace-pre-wrap"
                  style={
                    msg.role === "user"
                      ? { background: "#ff5c00", color: "#fff", borderBottomRightRadius: 4 }
                      : { background: "#2a2a2a", color: "#e5e5e5", borderBottomLeftRadius: 4 }
                  }
                >
                  {msg.content}
                  {loading && i === messages.length - 1 && msg.role === "assistant" && msg.content === "" && (
                    <span className="inline-flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3" style={{ borderTop: "1px solid #2a2a2a" }}>
            <input
              className="flex-1 rounded-xl px-3 py-2 text-sm text-white outline-none placeholder-gray-500"
              style={{ background: "#2a2a2a", border: "1px solid #3a3a3a" }}
              placeholder="Kuch poochein..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-40 cursor-pointer"
              style={{ background: "#ff5c00" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 left-4 z-50 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        style={{
          background: "transparent",
          border: "none",
          width: 72,
          height: 72,
          animation: open ? "none" : "robotFloat 2.5s ease-in-out infinite",
        }}
        aria-label="Chat with OZY Assistant"
      >
        <style>{`
          @keyframes botFloat {
            0%   { transform: translateY(0px) rotate(-2deg); }
            25%  { transform: translateY(-8px) rotate(2deg); }
            50%  { transform: translateY(-14px) rotate(-1deg); }
            75%  { transform: translateY(-6px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(-2deg); }
          }
          @keyframes botGlow {
            0%,100% { filter: drop-shadow(0 6px 16px rgba(100,180,255,0.55)); }
            50%      { filter: drop-shadow(0 10px 28px rgba(100,180,255,0.9)); }
          }
        `}</style>
        {open ? (
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 58, height: 58, background: "linear-gradient(135deg,#ff5c00,#ff8c00)", boxShadow: "0 4px 14px rgba(255,92,0,0.5)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </div>
        ) : (
          <img
            src={`${BASE}/bot-avatar.jpg`}
            alt="OZY Assistant"
            style={{
              width: 76,
              height: 76,
              objectFit: "contain",
              borderRadius: "50%",
              animation: "botFloat 3s ease-in-out infinite, botGlow 3s ease-in-out infinite",
            }}
          />
        )}
      </button>
    </>
  );
}
