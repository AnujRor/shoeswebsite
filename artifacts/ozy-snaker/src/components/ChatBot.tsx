import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/* ── TTS helpers ─────────────────────────────────── */

const VOICE_KEY = "ozy_voice_on";

function cleanForTTS(raw: string): string {
  let t = raw;
  t = t.replace(/https?:\/\/\S+/g, "");
  t = t.replace(/[*_`~>#\-]+/g, "");
  t = t.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2702}-\u{27B0}]+/gu,
    ""
  );
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

/** Split on sentence punctuation, commas, or newlines — jaldi se chhote chunks ready */
function splitSentences(text: string): string[] {
  const parts = text.split(/(?<=[.!?,\n])\s+/);
  return parts.map((s) => s.trim()).filter(Boolean);
}

/* ── Component ───────────────────────────────────── */

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Jai Shree Ram! \u{1F45F} OZY Sneakers mein aapka swagat hai. Main aapki kaise madad kar sakta hoon?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ── voice state ─────────────────────────────── */
  const [voiceOn, setVoiceOn] = useState(() => {
    try {
      return localStorage.getItem(VOICE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const voiceQueueRef = useRef<string[]>([]);
  const voiceBusyRef = useRef(false);
  const generationRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamBufferRef = useRef("");
  const prefetchedRef = useRef<{ audio: HTMLAudioElement; url: string } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(VOICE_KEY, String(voiceOn));
    } catch {
      /* ignore */
    }
  }, [voiceOn]);

  /* stop all voice on chat close or new message */
  const stopVoice = useCallback(() => {
    generationRef.current++;
    voiceQueueRef.current = [];
    voiceBusyRef.current = false;
    streamBufferRef.current = "";
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (prefetchedRef.current) {
      prefetchedRef.current.audio.pause();
      URL.revokeObjectURL(prefetchedRef.current.url);
      prefetchedRef.current = null;
    }
  }, []);

  /* fetch TTS audio → pre-loaded Audio element */
  const fetchTTS = useCallback(
    async (text: string, gen: number): Promise<{ audio: HTMLAudioElement; url: string } | null> => {
      const cleaned = cleanForTTS(text);
      if (cleaned.length < 3) return null;
      try {
        const resp = await fetch(`${BASE}/api/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: cleaned }),
        });
        if (!resp.ok || gen !== generationRef.current) return null;
        const blob = await resp.blob();
        if (gen !== generationRef.current) return null;
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        return { audio, url };
      } catch {
        return null;
      }
    },
    []
  );

  /* pump one sentence at a time — with pre-fetch */
  const pumpVoice = useCallback(
    async (gen: number) => {
      if (voiceBusyRef.current) return;
      while (voiceQueueRef.current.length > 0 && gen === generationRef.current) {
        voiceBusyRef.current = true;
        const sentence = voiceQueueRef.current.shift()!;

        /* use pre-fetched if available, else fetch now */
        let asset = prefetchedRef.current;
        prefetchedRef.current = null;

        if (!asset || gen !== generationRef.current) {
          asset = await fetchTTS(sentence, gen);
        }
        if (!asset || gen !== generationRef.current) {
          voiceBusyRef.current = false;
          continue;
        }

        /* pre-fetch next sentence while this one plays */
        if (voiceQueueRef.current.length > 0 && gen === generationRef.current) {
          const nextSentence = voiceQueueRef.current[0];
          fetchTTS(nextSentence, gen).then((next) => {
            if (gen === generationRef.current) prefetchedRef.current = next;
          });
        }

        const { audio, url } = asset;
        audioRef.current = audio;
        await new Promise<void>((resolve) => {
          audio.onended = () => {
            URL.revokeObjectURL(url);
            resolve();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            resolve();
          };
          audio.play().catch(() => {
            URL.revokeObjectURL(url);
            resolve();
          });
        });
        voiceBusyRef.current = false;
        /* tiny gap only — enough to not hit rate limit */
        if (gen === generationRef.current) {
          await new Promise((r) => setTimeout(r, 15));
        }
      }
      voiceBusyRef.current = false;
    },
    [fetchTTS]
  );

  /* push accumulated text into voice queue */
  const flushToVoice = useCallback(
    (gen: number) => {
      if (gen !== generationRef.current) return;
      const buf = streamBufferRef.current;
      if (!buf) return;
      const sentences = splitSentences(buf);
      if (sentences.length < 1) return;
      /* keep last incomplete sentence in buffer */
      const lastChar = buf.trimEnd().slice(-1);
      const endsCleanly = /[.!?,]/.test(lastChar);
      const complete = endsCleanly ? sentences : sentences.slice(0, -1);
      const leftover = endsCleanly ? "" : sentences[sentences.length - 1] ?? "";
      streamBufferRef.current = leftover;
      for (const s of complete) {
        voiceQueueRef.current.push(s);
      }
      pumpVoice(gen);
    },
    [pumpVoice]
  );

  /* scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ── send message ─────────────────────────────── */

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    /* stop previous voice, start fresh generation */
    stopVoice();
    const gen = ++generationRef.current;

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
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = JSON.parse(line.slice(6));
          if (json.done) {
            /* flush remaining buffer as final sentence */
            if (voiceOn && gen === generationRef.current) {
              const remaining = streamBufferRef.current.trim();
              if (remaining) voiceQueueRef.current.push(remaining);
              streamBufferRef.current = "";
              pumpVoice(gen);
            }
            break;
          }
          if (json.error) {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: json.error,
              };
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
            /* accumulate for voice */
            if (voiceOn && gen === generationRef.current) {
              streamBufferRef.current += json.content;
              flushToVoice(gen);
            }
          }
        }
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

  /* stop voice when chat closes */
  useEffect(() => {
    if (!open) stopVoice();
  }, [open, stopVoice]);

  /* speak greeting immediately when chat opens (voice on) */
  const greetingSpokenRef = useRef(false);
  useEffect(() => {
    if (!open || !voiceOn) {
      greetingSpokenRef.current = false;
      return;
    }
    if (greetingSpokenRef.current) return;
    greetingSpokenRef.current = true;
    const gen = ++generationRef.current;
    const greeting =
      "Jai Shree Ram! OZY Sneakers mein aapka swagat hai. Main aapki kaise madad kar sakta hoon?";
    voiceQueueRef.current = [];
    for (const s of splitSentences(greeting)) {
      voiceQueueRef.current.push(s);
    }
    pumpVoice(gen);
  }, [open, voiceOn, pumpVoice]);

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          style={{ background: "#0f0f0f" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: "#1a1a1a", borderBottom: "1px solid #2a2a2a" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "#ff5c00" }}
            >
              O
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold leading-none">
                OZY Assistant
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#22c55e" }}>
                ● Online
              </p>
            </div>

            {/* Voice toggle */}
            <button
              onClick={() => {
                if (voiceOn) stopVoice();
                setVoiceOn((v) => !v);
              }}
              className="text-lg leading-none transition-colors"
              style={{ color: voiceOn ? "#ff5c00" : "#6b7280" }}
              title={voiceOn ? "Voice ON — click to disable" : "Voice OFF — click to enable"}
            >
              {voiceOn ? "🔊" : "🔇"}
            </button>

            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-3 space-y-3"
            style={{ maxHeight: "320px", minHeight: "200px" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="px-3 py-2 rounded-2xl text-sm max-w-[85%] leading-relaxed whitespace-pre-wrap"
                  style={
                    msg.role === "user"
                      ? {
                          background: "#ff5c00",
                          color: "#fff",
                          borderBottomRightRadius: 4,
                        }
                      : {
                          background: "#2a2a2a",
                          color: "#e5e5e5",
                          borderBottomLeftRadius: 4,
                        }
                  }
                >
                  {msg.content}
                  {loading &&
                    i === messages.length - 1 &&
                    msg.role === "assistant" &&
                    msg.content === "" && (
                      <span className="inline-flex gap-1 ml-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </span>
                    )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex gap-2 p-3"
            style={{ borderTop: "1px solid #2a2a2a" }}
          >
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
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-40"
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
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-1"
        style={{
          animation: open ? "none" : "robotFloat 2.5s ease-in-out infinite",
        }}
      >
      {!open && (
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "1px",
            textShadow: "0 2px 10px rgba(255,255,255,0.6), 0 0 20px rgba(255,255,255,0.3)",
            userSelect: "none",
            textTransform: "uppercase",
            animation: "chatbotPulse 2s ease-in-out infinite",
          }}
        >
          Chatbot
        </span>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        style={{
          background: "transparent",
          border: "none",
          width: 90,
          height: 90,
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
          @keyframes chatbotPulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.08); }
          }
        `}</style>
        {open ? (
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 58,
              height: 58,
              background: "linear-gradient(135deg,#ff5c00,#ff8c00)",
              boxShadow: "0 4px 14px rgba(255,92,0,0.5)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </div>
        ) : (
          <div
            style={{
              width: 86,
              height: 86,
              perspective: "400px",
              animation: "botFloat 3s ease-in-out infinite",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              width="86"
              height="86"
              style={{
                filter: "drop-shadow(0 6px 18px rgba(255,255,255,0.55))",
                transition: "transform 0.4s cubic-bezier(.25,.8,.25,1)",
                transformStyle: "preserve-3d",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as SVGSVGElement).style.transform =
                  "rotateY(25deg) rotateX(-10deg) scale(1.1)";
                (e.currentTarget as SVGSVGElement).style.filter =
                  "drop-shadow(0 10px 28px rgba(255,255,255,0.9))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as SVGSVGElement).style.transform =
                  "rotateY(0deg) rotateX(0deg) scale(1)";
                (e.currentTarget as SVGSVGElement).style.filter =
                  "drop-shadow(0 6px 18px rgba(255,255,255,0.55))";
              }}
            >
              <defs>
                <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3a3a3a" />
                  <stop offset="100%" stopColor="#1a1a1a" />
                </linearGradient>
                <linearGradient id="faceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a2a2a" />
                  <stop offset="100%" stopColor="#111" />
                </linearGradient>
                <linearGradient id="antennaGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#555" />
                  <stop offset="100%" stopColor="#888" />
                </linearGradient>
                <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5c00" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ff5c00" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="eyeGlow" cx="0.5" cy="0.4" r="0.5">
                  <stop offset="0%" stopColor="#4df0ff" />
                  <stop offset="100%" stopColor="#00bcd4" />
                </radialGradient>
                <filter id="innerShadow">
                  <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Shadow on ground */}
              <ellipse cx="50" cy="92" rx="22" ry="4" fill="rgba(0,0,0,0.35)" />

              {/* Antenna */}
              <line x1="50" y1="18" x2="50" y2="8" stroke="url(#antennaGrad)" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="6" r="4" fill="#ff5c00" filter="url(#innerShadow)">
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Head - 3D effect with shadow side */}
              <rect x="22" y="18" width="56" height="40" rx="14" fill="url(#headGrad)" stroke="#444" strokeWidth="1.5" />
              <rect x="25" y="20" width="50" height="36" rx="12" fill="url(#faceGrad)" opacity="0.8" />

              {/* Eyes */}
              <g>
                {/* Left eye socket */}
                <ellipse cx="37" cy="36" rx="9" ry="10" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
                {/* Left eye */}
                <circle cx="37" cy="36" r="6" fill="url(#eyeGlow)" />
                <circle cx="35" cy="34" r="2" fill="#fff" opacity="0.9" />
                <circle cx="39" cy="37" r="1" fill="#fff" opacity="0.4" />

                {/* Right eye socket */}
                <ellipse cx="63" cy="36" rx="9" ry="10" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
                {/* Right eye */}
                <circle cx="63" cy="36" r="6" fill="url(#eyeGlow)" />
                <circle cx="61" cy="34" r="2" fill="#fff" opacity="0.9" />
                <circle cx="65" cy="37" r="1" fill="#fff" opacity="0.4" />
              </g>

              {/* Mouth - LED strip */}
              <rect x="34" y="50" width="32" height="4" rx="2" fill="#0a0a0a" stroke="#333" strokeWidth="0.8" />
              <rect x="36" y="51" width="5" height="2" rx="1" fill="#ff5c00">
                <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
              </rect>
              <rect x="43" y="51" width="5" height="2" rx="1" fill="#ff5c00">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
              </rect>
              <rect x="50" y="51" width="5" height="2" rx="1" fill="#ff5c00">
                <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
              </rect>
              <rect x="57" y="51" width="5" height="2" rx="1" fill="#ff5c00">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
              </rect>

              {/* Ears / side bolts */}
              <rect x="16" y="30" width="6" height="14" rx="3" fill="#444" stroke="#555" strokeWidth="0.8" />
              <rect x="78" y="30" width="6" height="14" rx="3" fill="#444" stroke="#555" strokeWidth="0.8" />

              {/* Body hint */}
              <rect x="30" y="60" width="40" height="24" rx="8" fill="url(#headGrad)" stroke="#444" strokeWidth="1.2" />
              <rect x="33" y="62" width="34" height="20" rx="6" fill="url(#faceGrad)" opacity="0.7" />

              {/* Chest light */}
              <circle cx="50" cy="72" r="5" fill="#ff5c00" opacity="0.8">
                <animate attributeName="r" values="4;5.5;4" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="72" r="3" fill="#fff" opacity="0.4" />

              {/* Arms */}
              <rect x="20" y="64" width="8" height="16" rx="4" fill="#3a3a3a" stroke="#555" strokeWidth="0.8" />
              <rect x="72" y="64" width="8" height="16" rx="4" fill="#3a3a3a" stroke="#555" strokeWidth="0.8" />
            </svg>
          </div>
        )}
      </button>
      </div>
    </>
  );
}
