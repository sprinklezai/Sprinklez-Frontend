import { useMemo, useState } from "react";
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

import {
  askSalesAssistant,
  type SalesChatFilters,
} from "../../api/salesChat";

interface Props {
  filters: SalesChatFilters;
}

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
}

const suggestions = [
  "Summarize the selected sales period for management.",
  "Which stores need management attention?",
  "Which country contributes the most revenue?",
  "What are the top-selling items by revenue?",
];

function SalesAiChat({ filters }: Props) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text:
        "Hello. I answer using the currently selected brand, period, country, store and date range.",
    },
  ]);

  const context = useMemo(
    () =>
      [
        filters.brandCode,
        filters.period,
        filters.fromDate && filters.toDate
          ? `${filters.fromDate} to ${filters.toDate}`
          : "",
      ]
        .filter(Boolean)
        .join(" · "),
    [filters]
  );

  async function send(value?: string) {
    const text = String(value || question).trim();

    if (!text || sending) return;

    setMessages((current) => [
      ...current,
      {
        id: `u-${Date.now()}`,
        role: "user",
        text,
      },
    ]);

    setQuestion("");
    setSending(true);

    try {
      const result = await askSalesAssistant(text, filters);

      setMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: result.answer,
        },
      ]);
    } catch (error: any) {
      setMessages((current) => [
        ...current,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text:
            error?.response?.status === 401
              ? "Your login session has expired. Please sign in again."
              : error?.response?.data?.message ||
                "I could not answer that question.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-[#0F6B52] px-5 py-4 font-bold text-white shadow-2xl hover:bg-[#0B553F]"
      >
        <MessageCircle size={21} />
        <span className="hidden sm:inline">Ask Sprinklez AI</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-end bg-slate-950/20 backdrop-blur-[2px] sm:p-6">
          <section className="flex h-[85vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-[720px] sm:w-[430px] sm:rounded-3xl">
            <header className="bg-gradient-to-r from-[#0F6B52] to-[#063F31] p-5 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/15 p-3">
                    <Bot size={23} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-extrabold">Sprinklez AI</h2>
                      <Sparkles size={15} className="text-amber-300" />
                    </div>
                    <p className="text-xs text-emerald-100">Sales Assistant</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl p-2 hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-[11px]">
                Current context: {context}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-[#F4F8F6] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F6B52] text-white">
                        <Bot size={16} />
                      </div>
                    )}

                    <div
                      className={`max-w-[84%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                        message.role === "user"
                          ? "bg-[#0F6B52] text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {message.text}
                    </div>

                    {message.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-white">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                ))}

                {sending && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Loader2 size={16} className="animate-spin" />
                    Analysing selected sales data...
                  </div>
                )}
              </div>

              {messages.length === 1 && (
                <div className="mt-6 space-y-2">
                  {suggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => send(item)}
                      className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-left text-xs font-semibold"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <footer className="border-t border-slate-200 p-4">
              <div className="flex items-end gap-2">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      send();
                    }
                  }}
                  maxLength={500}
                  rows={2}
                  placeholder="Ask about sales, stores, countries, channels or items..."
                  className="flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />

                <button
                  type="button"
                  onClick={() => send()}
                  disabled={sending || !question.trim()}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F6B52] text-white disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}

export default SalesAiChat;
