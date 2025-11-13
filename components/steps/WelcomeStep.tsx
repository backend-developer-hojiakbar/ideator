import React from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';

interface WelcomeStepProps {
  onStart: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full animate-fade-in">
      <SparklesIcon className="w-20 h-20 text-cyan-500 dark:text-cyan-400" />
      <h1 className="text-3xl md:text-4xl font-bold mt-4 text-gray-800 dark:text-gray-100">G'oya Mashinasi</h1>
      <p className="mt-4 max-w-md text-gray-600 dark:text-gray-300">
        O'zbekiston bozori uchun mo'ljallangan, AI yordamida yaratilgan noyob startap g'oyalari va to'liq biznes-rejalarni oling.
      </p>
      <button 
        onClick={onStart}
        className="mt-8 px-8 py-3 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
      >
        Boshlash
      </button>
    </div>
  );
};
