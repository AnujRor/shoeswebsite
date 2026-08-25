import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Jai Shree Ram! 👟 OZY Sneakers mein aapka swagat hai. Main aapki kaise madad kar sakta hoon?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

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
              <p className="text-xs mt-0.5" style={{ color: "#22c55e" }}>● Online</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-lg leading-none">✕</button>
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
