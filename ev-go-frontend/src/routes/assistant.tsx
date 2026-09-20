import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { api } from "../lib/api";
import { RequireAuth } from "../components/RequireAuth";

interface Message {
  role: "user" | "assistant";
  content: string;
  fallback?: boolean;
}

export const Route = createFileRoute("/assistant")({
  component: () => <RequireAuth><AssistantPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "AI Assistant \u2014 EV GO" },
      { name: "description", content: "Ask anything about EV charging reservations, stations and pricing." },
      { property: "og:title", content: "AI Assistant \u2014 EV GO" },
      { property: "og:type", content: "website" },
    ],
  }),
});

function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post<{ reply: string; fallback: boolean }>(
        "/ai/chat",
        { message: text.trim() }
      );
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, fallback: data.fallback }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't reach the assistant. Please try again.", fallback: true }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  const suggestions = [
    { label: "Find nearby stations", icon: "near_me" },
    { label: "Check my bookings", icon: "calendar_month" },
    { label: "Help with payment", icon: "payments" },
    { label: "Report an issue", icon: "report_problem" },
  ];

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-[28px]">ev_station</span>
            <span className="font-headline-md tracking-tight text-primary font-bold">EV GO</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/stations" className="px-3 py-1.5 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">Find Stations</Link>
            <Link to="/bookings" className="px-3 py-1.5 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">My Bookings</Link>
            <Link to="/assistant" className="px-3 py-1.5 transition-colors bg-primary-container text-on-primary font-semibold rounded-lg">AI Assistant</Link>
          </nav>
        </div>
      </header>

      <main className="w-full flex-1 pt-16 bg-surface flex flex-col">
        <div className="max-w-4xl w-full mx-auto px-4 md:px-8 py-6 flex flex-col gap-4 flex-1">

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <h1 className="font-headline-lg text-primary tracking-tight font-bold">AI Assistant</h1>
            <p className="font-body-md text-on-surface-variant mt-1">Ask me anything about EV charging, stations, and your bookings</p>
            <p className="font-body-sm text-on-surface-variant mt-2 text-xs">This assistant provides conversational answers only — it cannot book slots or modify reservations on your behalf.</p>
          </div>

          {/* Chat area */}
          <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex-1 min-h-[500px]">
            <div className="px-6 py-3 bg-surface-container-low flex items-center justify-between border-b border-border-ui">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
                <span className="font-label-md text-on-surface font-semibold">EV GO Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="font-label-sm text-on-surface-variant">Online</span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[450px]">
              {messages.length === 0 && (
                <p className="text-center text-on-surface-variant font-body-sm pt-8">Start a conversation by typing a question below.</p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-xl ${msg.role === "user" ? "bg-primary-container text-on-primary rounded-br-none" : `bg-surface-container-low text-on-surface rounded-tl-none ${msg.fallback ? "border border-error/30" : ""}`}`}>
                    <p className="font-body-md whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-xl rounded-tl-none">
                    <span className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce [animation-delay:0ms]"></span>
                      <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce [animation-delay:150ms]"></span>
                      <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce [animation-delay:300ms]"></span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestion chips */}
            <div className="px-6 py-2 bg-surface-container-lowest border-t border-border-ui">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => void sendMessage(s.label)}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-sm transition-colors flex items-center gap-1"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-surface-container-low border-t border-border-ui">
              <form className="flex items-center gap-2" onSubmit={handleSubmit}>
                <input
                  autoComplete="off"
                  className="flex-1 h-12 px-4 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/70 font-body-md focus:outline-none shadow-sm"
                  placeholder="Ask me anything…"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="h-12 w-12 rounded-lg bg-primary-container hover:bg-primary text-on-primary flex items-center justify-center shrink-0 transition-colors shadow-sm disabled:opacity-50"
                  disabled={loading || !input.trim()}
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
