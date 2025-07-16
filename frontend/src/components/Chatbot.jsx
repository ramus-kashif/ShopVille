import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

const FAQ = [
  {
    q: /payment|pay|method|card|cash|how.*pay|accept/i,
    a: "We accept multiple payment methods including credit/debit cards, cash on delivery, and online bank transfers."
  },
  {
    q: /address|location|where.*shop|find.*shop|store.*located/i,
    a: "Our shop is based online, but our main office is located at 123 Main Street, Karachi, Pakistan."
  },
  {
    q: /contact|phone|email|support|help/i,
    a: "You can contact us at support@shopville.com or call us at +92-300-1234567."
  },
  {
    q: /delivery|shipping|ship|how.*long|when.*receive/i,
    a: "We offer fast delivery across Pakistan. Orders are usually delivered within 2-5 business days."
  },
  {
    q: /return|refund|exchange|policy/i,
    a: "We have a 7-day return and exchange policy. Please visit our Returns & Refunds page for more details."
  },
  {
    q: /open|timing|hours|when.*open|close/i,
    a: "Our online shop is open 24/7! You can place orders anytime."
  },
  {
    q: /.*/,
    a: "I'm here to help! Please ask about payments, delivery, returns, or contact info."
  }
];

function getBotAnswer(userMsg) {
  for (const { q, a } of FAQ) {
    if (q.test(userMsg)) return a;
  }
  return FAQ[FAQ.length - 1].a;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! 👋 I'm Vill-E. How can I help you today?" }
  ]);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg) return;
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: getBotAnswer(userMsg) }
      ]);
    }, 500);
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-[#FF6B00] hover:bg-[#FF8C42] text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]/30"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chatbot"
        style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.18)" }}
      >
        <MessageCircle className="w-8 h-8" />
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-28 right-8 z-50 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-[#FF6B00]/20 flex flex-col transition-all duration-300 ${open ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-8"}`}
        style={{ minHeight: open ? 420 : 0, maxHeight: 500 }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#FF6B00]/10 bg-[#FF6B00]/10 rounded-t-2xl">
          <div className="flex items-center gap-2 font-bold text-[#FF6B00] text-lg">
            <Bot className="w-6 h-6" /> Vill-E
          </div>
          <button onClick={() => setOpen(false)} className="text-[#FF6B00] hover:text-[#FF8C42] p-1 rounded-full focus:outline-none">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div ref={panelRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-white">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-xl px-4 py-2 max-w-[80%] text-sm shadow ${msg.from === "user" ? "bg-[#FF6B00] text-white" : "bg-[#F8F9FA] text-[#1C1C1E]"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex items-center gap-2 px-5 py-4 border-t border-[#FF6B00]/10 bg-[#F8F9FA] rounded-b-2xl">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 rounded-lg border border-[#E0E0E0] focus:border-[#FF6B00] focus:outline-none text-sm bg-white"
            autoComplete="off"
          />
          <button type="submit" className="bg-[#FF6B00] hover:bg-[#FF8C42] text-white rounded-lg p-2 transition-all duration-200 focus:outline-none">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </>
  );
} 