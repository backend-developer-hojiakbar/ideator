import React, { useState, useRef, useEffect } from 'react';
import type { StartupIdea, ChatMessage } from '../types';
import { getAiMentorResponse } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

interface AIMentorChatProps {
  idea: StartupIdea;
  onClose: () => void;
}

export const AIMentorChat: React.FC<AIMentorChatProps> = ({ idea, onClose }) => {
  const { lang } = useLanguage();
  const [history, setHistory] = useState<ChatMessage[]>([
    { role: 'model', text: `Salom! Men sizning shaxsiy AI biznes-mentoringizman. "${idea.projectName}" g'oyangiz bo'yicha har qanday savolingizga javob berishga tayyorman. Masalan, "Asosiy risklar nima?" deb so'rashingiz mumkin.` }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newHistory: ChatMessage[] = [...history, { role: 'user', text: userInput }];
    setHistory(newHistory);
    setUserInput('');
    setIsLoading(true);

    try {
      // FIX: Pass the 'lang' argument to the function call.
      const modelResponse = await getAiMentorResponse(newHistory, userInput, idea, lang);
      setHistory(prev => [...prev, { role: 'model', text: modelResponse }]);
    } catch (error) {
      console.error(error);
      setHistory(prev => [...prev, { role: 'model', text: "Kechirasiz, xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-lg h-[80vh] max-h-[700px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">AI Biznes Maslahatchi</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
          {history.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-cyan-500 text-white rounded-br-none'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
              }`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none">
                <LoadingSpinner className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Savolingizni yozing..."
              disabled={isLoading}
              className="w-full p-3 pr-12 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg border dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
            />
            <button type="submit" disabled={isLoading || !userInput.trim()} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-cyan-500 hover:text-cyan-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};