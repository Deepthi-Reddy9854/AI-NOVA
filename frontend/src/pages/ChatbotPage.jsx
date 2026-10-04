import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import { Bot, Send, User, Sparkles, Loader2, HelpCircle } from 'lucide-react';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! I am **Nova AI**, your dedicated Academic-to-Career Advisor. 🚀\n\nI can guide you with technical roadmaps, resume building tips, portfolio projects, and internship strategies. How can I help you today?`
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const samplePrompts = [
    "HTML & Web Development Roadmap",
    "What should I learn for an AI Engineer career?",
    "Which career is best for me?",
    "How can I improve my resume?",
    "What projects should I build?",
    "How do I prepare for an internship?"
  ];

  const formatMessageText = (text) => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-cyan-300">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await chatAPI.getHistory();
        if (res.data?.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sending) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setSending(true);

    try {
      const res = await chatAPI.sendMessage(text);
      if (res.data?.reply) {
        setMessages((prev) => [...prev, { sender: 'bot', text: res.data.reply }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'I encountered an error processing your query. Please check your internet connection or backend server.'
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-4">
      {/* Header */}
      <div className="glass-card p-4 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-glow">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Nova AI Career Advisor</h1>
            <p className="text-xs text-slate-400">Instant answers for roadmaps, resumes & internship prep</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Engine Online</span>
        </span>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-[11px] font-bold uppercase text-slate-500 shrink-0">Prompts:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-medium shrink-0 transition-all cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Log Window */}
      <div className="flex-1 glass-card p-6 rounded-3xl border border-slate-800 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={index}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-glow'
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none font-sans whitespace-pre-wrap'
                }`}
              >
                {formatMessageText(msg.text)}
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-600 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center space-x-2 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Analyzing academic context & generating advice...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="glass-card p-2 rounded-2xl border border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder="Ask anything (e.g. How to prepare for an AI internship?)"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
        />
        <button
          type="submit"
          disabled={sending || !inputMessage.trim()}
          className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-glow transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatbotPage;
