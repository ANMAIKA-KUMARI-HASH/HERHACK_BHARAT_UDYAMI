import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, X, Send, Sparkles, HelpCircle, ChevronRight, CornerDownLeft } from 'lucide-react';
import { askSellerAssistant } from '../services/api';

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Namaste! I am your Bharat Udyami AI Advisor. I can help you calculate fair cost-plus prices, optimize product descriptions, plan safe packaging for fragile goods, and match with wholesale commercial buyers across India. What would you like guidance on today?"
    }
  ]);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "How should I price my product?",
    "How do I take good photos?",
    "Can I speak in my mother tongue?",
    "How does wholesale tier pricing work?",
    "How can I improve my listing?",
    "Which buyers might purchase my product?",
    "How should I package my product?",
    "How to eliminate middleman margins?"
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await askSellerAssistant(q);
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.answer || "I could not generate an answer right now. Please try again."
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "Trouble reaching the AI advisor server. Please ensure the backend is running."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-orange-50 text-slate-800 rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 border-2 border-[#FF9933]"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#EA580C]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF9933] rounded-full animate-ping" />
          </div>
          <span className="font-bold text-xs text-slate-900">AI Seller Advisor</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 text-left">
          {/* Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 rounded-lg text-[#EA580C]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  Bharat Udyami AI Advisor
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-[#FF9933] text-slate-900 rounded">
                    Active
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500">Mentorship for India's Producers</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/50 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-2.5 leading-relaxed text-xs ${
                    msg.sender === 'user'
                      ? 'bg-orange-100 text-slate-900 border border-orange-200 rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl p-3 rounded-tl-none flex items-center gap-1.5 text-slate-500 text-xs">
                  <Sparkles className="w-4 h-4 text-[#FF9933] animate-spin" />
                  <span>AI Advisor is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="shrink-0 px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-[#FF9933] hover:border-[#FF9933] border border-slate-200 rounded-full text-slate-700 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about pricing, packaging, buyers..."
              className="flex-1 text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#FF9933] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-[#FF9933] hover:bg-[#F97316] disabled:opacity-50 text-slate-900 font-bold rounded-lg transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
