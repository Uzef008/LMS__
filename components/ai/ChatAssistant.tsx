"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "ai";
  text: string;
}

/**
 * Client-side fallback check to provide instant UI response
 */
const getClientFallback = (message: string) => {
  const msg = message.toLowerCase().trim();
  if (msg === "hi" || msg === "hello") return "Hello 👋! How can I help you today?";
  if (msg === "thanks" || msg === "thank you") return "You're welcome 🙌 Happy learning!";
  return null;
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hello! I'm your AI tutor. How can I help you with your learning today?" }
  ]);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      if (e.detail?.lesson) {
        setCurrentLesson(e.detail.lesson);
        setMessages(prev => [...prev, { role: "ai", text: `I see you're studying "${e.detail.lesson}". I'm ready to help with any questions about it!` }]);
      }
    };
    document.addEventListener('open-ai-chat', handleOpenChat);
    return () => document.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);

    // Check for "Super Instant" client-side fallback (Greetings only)
    const clientFallback = getClientFallback(userMessage);
    if (clientFallback) {
      setMessages(prev => [...prev, { role: "ai", text: clientFallback }]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ 
          message: userMessage,
          lessonTitle: currentLesson 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.reply || data.error || "Failed to get AI response");
      }

      setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "ai", text: error.message || "I'm having trouble connecting 🤖 but I can still help with basic questions!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/40 z-[100]"
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-[380px] h-[580px] bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl z-[100] flex flex-col overflow-hidden backdrop-blur-xl"
          >
            <div className="p-5 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                  <Bot className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">AI Study Buddy</h3>
                  <p className="text-[10px] text-zinc-500 font-medium tracking-wide italic">Instant Fallback Active ✅</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex w-full",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm",
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none font-medium" 
                      : "bg-zinc-900/50 border border-white/10 text-zinc-200 rounded-tl-none font-normal"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900/50 border border-white/10 p-4 rounded-2xl rounded-tl-none flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                       <Loader2 className="h-3 w-3 text-indigo-400 animate-spin" />
                       <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">AI is thinking...</span>
                    </div>
                    <div className="flex space-x-1 mt-1">
                      <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-zinc-950/80 backdrop-blur-md">
              <div className="relative flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={currentLesson ? `Ask about ${currentLesson}...` : "Write your question..."}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3.5 pl-5 pr-12 text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white disabled:opacity-50 disabled:bg-zinc-800 transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[9px] text-center text-zinc-800 mt-2 font-medium">
                DeepSeek-R1 active for complex queries.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
