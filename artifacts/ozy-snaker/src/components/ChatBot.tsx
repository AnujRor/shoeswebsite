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

  /* robot eyes follow the cursor — jahan bhi cursor le jao, eyes use dekh-te hain */
  const robotSvgRef = useRef<SVGSVGElement>(null);
  const eyePupilRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const svgEl = robotSvgRef.current;
      const pupils = eyePupilRef.current;
      if (!svgEl || !pupils) return;
      const rect = svgEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = ((e.clientX - cx) / rect.width) * 100;
      let dy = ((e.clientY - cy) / rect.height) * 100;
      const max = 2.4;
      const dist = Math.hypot(dx, dy);
      if (dist > max) {
        dx = (dx / dist) * max;
        dy = (dy / dist) * max;
      }
      pupils.setAttribute("transform", `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-20 right-3 sm:right-4 z-50 w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-2rem)] max-w-sm sm:max-w-md md:max-w-lg flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-white/10"
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
            style={{ maxHeight: "min(350px, 50vh)", minHeight: "180px" }}
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
        className="fixed bottom-4 right-3 sm:right-4 z-50 flex flex-col items-center gap-1"
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
          width: "clamp(64px, 12vw, 90px)",
          height: "clamp(64px, 12vw, 90px)",
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
              width: "clamp(46px, 8vw, 58px)",
              height: "clamp(46px, 8vw, 58px)",
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
              width: "clamp(64px, 11vw, 86px)",
              height: "clamp(64px, 11vw, 86px)",
              perspective: "400px",
              animation: "botFloat 3s ease-in-out infinite",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              width="100%"
              height="100%"
              ref={robotSvgRef}
              style={{
                filter: "drop-shadow(0 6px 16px rgba(15,23,42,0.32))",
                transition: "transform 0.4s cubic-bezier(.25,.8,.25,1)",
                transformStyle: "preserve-3d",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as SVGSVGElement).style.transform =
                  "rotateY(25deg) rotateX(-10deg) scale(1.1)";
                (e.currentTarget as SVGSVGElement).style.filter =
                  "drop-shadow(0 10px 26px rgba(30,64,120,0.45))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as SVGSVGElement).style.transform =
                  "rotateY(0deg) rotateX(0deg) scale(1)";
                (e.currentTarget as SVGSVGElement).style.filter =
                  "drop-shadow(0 6px 16px rgba(15,23,42,0.32))";
              }}
            >
              <defs>
                <linearGradient id="metalGrad" x1="0" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="#f4f6f9" />
                  <stop offset="55%" stopColor="#c2c9d3" />
                  <stop offset="100%" stopColor="#7f8896" />
                </linearGradient>
                <linearGradient id="metalDark" x1="0" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="#aab3c0" />
                  <stop offset="100%" stopColor="#6c7583" />
                </linearGradient>
                <linearGradient id="visorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2b3342" />
                  <stop offset="100%" stopColor="#101623" />
                </linearGradient>
                <linearGradient id="antennaGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#8a93a0" />
                  <stop offset="100%" stopColor="#d5dbe4" />
                </linearGradient>
                <radialGradient id="eyeGlow" cx="0.5" cy="0.4" r="0.5">
                  <stop offset="0%" stopColor="#7db4ff" />
                  <stop offset="100%" stopColor="#1f4fd8" />
                </radialGradient>
                <filter id="innerShadow">
                  <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Shadow on ground */}
              <ellipse cx="50" cy="92" rx="22" ry="4" fill="rgba(0,0,0,0.22)" />

              {/* Antenna — silver stem, blue tip */}
              <line x1="50" y1="18" x2="50" y2="8" stroke="url(#antennaGrad)" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="6" r="4" fill="#2563eb" filter="url(#innerShadow)">
                <animate attributeName="opacity" values="1;0.55;1" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Head — brushed steel with gloss highlight */}
              <rect x="22" y="18" width="56" height="40" rx="14" fill="url(#metalGrad)" stroke="#5f6b7a" strokeWidth="1.5" />
              <rect x="25" y="21" width="50" height="34" rx="12" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
              <ellipse cx="36" cy="25" rx="8" ry="3" fill="#ffffff" opacity="0.45" />

              {/* Dark visor band */}
              <rect x="27" y="28" width="46" height="16" rx="8" fill="url(#visorGrad)" stroke="#4a5568" strokeWidth="0.9" />

              {/* Eyes (blue) — cursor follow */}
              <g ref={eyePupilRef}>
                <circle cx="37" cy="36" r="5.5" fill="url(#eyeGlow)" />
                <circle cx="35.2" cy="34.2" r="1.8" fill="#ffffff" opacity="0.9" />
                <circle cx="39" cy="37" r="0.9" fill="#ffffff" opacity="0.45" />
                <circle cx="63" cy="36" r="5.5" fill="url(#eyeGlow)" />
                <circle cx="61.2" cy="34.2" r="1.8" fill="#ffffff" opacity="0.9" />
                <circle cx="65" cy="37" r="0.9" fill="#ffffff" opacity="0.45" />
              </g>

              {/* Mouth — subtle slot with small blue LEDs */}
              <rect x="34" y="50" width="32" height="3.5" rx="1.75" fill="#0f1722" stroke="#4a5568" strokeWidth="0.8" />
              <rect x="37" y="51" width="4.5" height="1.5" rx="0.75" fill="#3b82f6" opacity="0.9">
                <animate attributeName="opacity" values="1;0.4;1" dur="0.9s" repeatCount="indefinite" />
              </rect>
              <rect x="43.5" y="51" width="4.5" height="1.5" rx="0.75" fill="#3b82f6" opacity="0.5">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="0.9s" repeatCount="indefinite" />
              </rect>
              <rect x="50" y="51" width="4.5" height="1.5" rx="0.75" fill="#3b82f6" opacity="0.9">
                <animate attributeName="opacity" values="1;0.4;1" dur="0.9s" repeatCount="indefinite" begin="0.25s" />
              </rect>
              <rect x="56.5" y="51" width="4.5" height="1.5" rx="0.75" fill="#3b82f6" opacity="0.5">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="0.9s" repeatCount="indefinite" begin="0.25s" />
              </rect>

              {/* Ears / side bolts — steel */}
              <rect x="16" y="30" width="6" height="14" rx="3" fill="url(#metalDark)" stroke="#7b8492" strokeWidth="0.8" />
              <rect x="78" y="30" width="6" height="14" rx="3" fill="url(#metalDark)" stroke="#7b8492" strokeWidth="0.8" />

              {/* Body — metal chest with dark status panel */}
              <rect x="30" y="60" width="40" height="24" rx="8" fill="url(#metalGrad)" stroke="#5f6b7a" strokeWidth="1.2" />
              <rect x="36" y="65" width="28" height="15" rx="5" fill="url(#visorGrad)" stroke="#4a5568" strokeWidth="0.9" />

              {/* Chest status light */}
              <circle cx="50" cy="73" r="4.5" fill="#2563eb" opacity="0.9">
                <animate attributeName="r" values="3.8;4.6;3.8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="73" r="2.6" fill="#ffffff" opacity="0.35" />

              {/* Arms — steel */}
              <rect x="20" y="64" width="9" height="16" rx="4.5" fill="url(#metalDark)" stroke="#7b8492" strokeWidth="0.8" />
              <rect x="71" y="64" width="9" height="16" rx="4.5" fill="url(#metalDark)" stroke="#7b8492" strokeWidth="0.8" />
            </svg>
          </div>
        )}
      </button>
      </div>
    </>
  );
}
