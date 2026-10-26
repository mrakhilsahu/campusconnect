import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MessageCircle, X, Send, Loader2, Trash2, Sparkles } from "lucide-react";
import { sendAIMessage } from "../api/ai";

const ROLE_LABEL = {
  STUDENT: "Student Assistant",
  TEACHER: "Teacher Assistant",
  ADMIN: "Admin Assistant",
};

const ROLE_SUGGESTIONS = {
  STUDENT: [
    "What events can I still register for?",
    "What's my attendance for events I joined?",
    "Which of my registered events are upcoming?",
  ],
  TEACHER: [
    "How many students registered for my latest event?",
    "What's the attendance summary for my events?",
    "Which of my events are still pending approval?",
  ],
  ADMIN: [
    "How many events are pending approval?",
    "Give me a summary of this college's events.",
    "How many students and teachers are registered?",
  ],
};

function AIAssistant() {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', content }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  // Don't render anything for logged-out visitors.
  if (!user) return null;

  const roleLabel = ROLE_LABEL[user.role] || "Assistant";
  const suggestions = ROLE_SUGGESTIONS[user.role] || [];

  const handleSend = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const data = await sendAIMessage(
        text,
        nextMessages.slice(-16) // recent history only
      );
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong reaching the AI assistant. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI Assistant" : "Open AI Assistant"}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles size={18} className="shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight truncate">
                  CampusConnect AI
                </p>
                <p className="text-[11px] text-indigo-100 leading-tight truncate">
                  {roleLabel} &bull; {user.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              title="Clear conversation"
              className="p-1.5 rounded-lg hover:bg-white/10 transition shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-6 px-2">
                <p className="text-sm text-gray-500 mb-4">
                  Ask me anything about your CampusConnect events, registrations, or attendance.
                </p>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="w-full text-left text-xs bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 px-3 py-2 rounded-lg transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-500 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-2.5 bg-white shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about events, attendance, registrations..."
                rows={1}
                maxLength={1000}
                disabled={loading}
                className="flex-1 resize-none text-sm px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 max-h-24"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="shrink-0 w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AIAssistant;
