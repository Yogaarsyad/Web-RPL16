import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCpu, FiUser, FiMessageSquare, FiLoader, FiPlus, FiTrash2 } from 'react-icons/fi';
import { postChat } from '../services/api'; 

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- 1. LOAD HISTORY ---
  const [messages, setMessages] = useState(() => {
    const savedChat = localStorage.getItem('chat_history');
    return savedChat ? JSON.parse(savedChat) : [
      { 
        id: 1, 
        sender: 'ai', 
        text: 'Hello! I am LifeMon AI. Ready to analyze your health data. How can I help you today?' 
      }
    ];
  });

  // --- 2. AUTO SAVE ---
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- 3. NEW CHAT ---
  const handleNewChat = () => {
    if (window.confirm("Start a new topic? Current chat history will be deleted.")) {
      const initialMsg = [{ 
        id: Date.now(), 
        sender: 'ai', 
        text: 'Hello! A new conversation has started. What would you like to ask?' 
      }];
      setMessages(initialMsg); 
      localStorage.setItem('chat_history', JSON.stringify(initialMsg)); 
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    const userMessage = { id: Date.now(), sender: 'user', text: userText };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      conversationHistory.push({ role: 'user', content: userText });

      const response = await postChat({ messages: conversationHistory });

      const aiResponseText = response.data?.choices?.[0]?.message?.content || 
                             response.data?.message || 
                             response.data?.answer ||
                             "Sorry, I didn't get a valid response.";

      const aiMessage = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: aiResponseText 
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: 'Sorry, connection to AI server lost. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Wrapper: Gunakan h-[calc(100vh-theme(spacing.24))] untuk mengisi sisa layar di dashboard
    <div className="flex flex-col h-full bg-transparent font-sans text-slate-100">
      
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
         <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AI Assistant</h1>
            <p className="text-slate-400 text-sm mt-1">Smart health consultation powered by data.</p>
         </div>
         
         <button 
            onClick={handleNewChat}
            className="flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-95 text-sm font-semibold border border-blue-500/50"
         >
            <FiPlus className="mr-2 text-lg" /> New Chat
         </button>
      </div>

      {/* CHAT CARD (Glassmorphism Dark) */}
      <div className="flex-1 bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/5 relative">
        
        {/* Chat Header (Status Bar) */}
        <div className="bg-gray-900/50 p-4 px-6 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FiCpu className="text-white text-xl" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg leading-tight">LifeMon Bot</h2>
            <div className="flex items-center gap-2 text-xs text-green-400 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              Online & Ready
            </div>
          </div>
        </div>

        {/* MESSAGES LIST AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
               <div className="p-6 bg-white/5 rounded-full mb-4">
                 <FiMessageSquare className="text-5xl text-slate-400" />
               </div>
               <p className="text-lg font-medium">Start a new conversation.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div key={msg.id} className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} animate-fade-in`}>
                   
                   {/* Avatar Bot */}
                   {isAi && (
                     <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 mt-1 flex-shrink-0 border border-blue-500/30">
                        <FiCpu className="text-blue-400 text-sm" />
                     </div>
                   )}
                  
                   {/* Chat Bubble */}
                   <div className={`relative max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm leading-relaxed text-sm md:text-base ${
                    isAi 
                      ? 'bg-slate-700/50 text-slate-100 border border-white/5 rounded-tl-none' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-900/20 rounded-tr-none'
                   }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    {/* Timestamp */}
                    <span className={`text-[10px] block text-right mt-1.5 opacity-60 ${isAi ? 'text-slate-400' : 'text-blue-100'}`}>
                      {new Date(msg.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>

                   {/* Avatar User */}
                   {!isAi && (
                     <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center ml-3 mt-1 flex-shrink-0 border border-slate-600">
                        <FiUser className="text-slate-300 text-sm" />
                     </div>
                   )}
                </div>
              );
            })
          )}

          {/* Loading Animation */}
          {isLoading && (
            <div className="flex w-full justify-start animate-pulse">
               <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 border border-blue-500/30">
                  <FiCpu className="text-blue-400 text-sm" />
               </div>
               <div className="bg-slate-700/50 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-400">
                  <FiLoader className="animate-spin" />
                  <span className="text-sm italic">Thinking...</span>
               </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <form onSubmit={handleSend} className="p-4 bg-gray-900/30 border-t border-white/5 flex gap-3 items-center backdrop-blur-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your health question..."
            disabled={isLoading}
            className="flex-1 pl-5 pr-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:bg-slate-800 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-slate-200 placeholder-slate-500 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white p-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-95 disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isLoading ? <FiLoader className="animate-spin text-xl" /> : <FiSend className={`text-xl ${input.trim() ? '-ml-0.5' : ''}`} />}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChatPage;