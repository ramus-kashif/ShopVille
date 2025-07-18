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
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B00] text-white rounded-2xl shadow-2xl w-14 h-14 flex items-center justify-center transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]/30 transform hover:scale-110 hover:rotate-3 group"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chatbot"
        style={{ 
          boxShadow: "0 8px 32px 0 rgba(255,107,0,0.3)",
          background: "linear-gradient(135deg, #FF6B00 0%, #FF8C42 100%)",
          animation: "breathe 3s ease-in-out infinite"
        }}
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
          {/* Floating particles effect */}
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-300 rounded-full opacity-60 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-1 -right-2 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-60 animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-72 max-w-[90vw] bg-white rounded-3xl shadow-2xl border border-[#FF6B00]/20 flex flex-col transition-all duration-500 ${open ? "opacity-100 pointer-events-auto translate-y-0 scale-100" : "opacity-0 pointer-events-none translate-y-8 scale-95"}`}
        style={{ minHeight: open ? 380 : 0, maxHeight: 480 }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#FF6B00]/10 bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8C42]/10 rounded-t-3xl">
          <div className="flex items-center gap-2 font-bold text-[#FF6B00] text-base">
            <div className="relative">
              <Bot className="w-5 h-5" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            Vill-E AI
          </div>
          <button onClick={() => setOpen(false)} className="text-[#FF6B00] hover:text-[#FF8C42] p-1 rounded-full focus:outline-none transition-colors duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div ref={panelRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-white">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`rounded-2xl px-3 py-2 max-w-[85%] text-xs shadow-sm ${msg.from === "user" ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white" : "bg-[#F8F9FA] text-[#1C1C1E] border border-[#E0E0E0]"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-[#FF6B00]/10 bg-[#F8F9FA] rounded-b-3xl">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Vill-E anything..."
            className="flex-1 px-3 py-2 rounded-xl border border-[#E0E0E0] focus:border-[#FF6B00] focus:outline-none text-xs bg-white"
            autoComplete="off"
          />
          <button type="submit" className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B00] text-white rounded-xl p-2 transition-all duration-300 focus:outline-none transform hover:scale-105">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
} 