import React, { useState, useMemo } from 'react';
import type { StartupIdea, AnswerFeedback } from '../types';
import { getAnswerFeedback } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { useLanguage } from '../contexts/LanguageContext';


interface AIInvestorPrepProps {
  idea: StartupIdea;
  onUpdateProject: (updatedIdea: StartupIdea) => void;
}

interface FeedbackState {
    [slideIndex: number]: {
        isLoading: boolean;
        feedback: AnswerFeedback | null;
        error: string | null;
    };
}

export const AIInvestorPrep: React.FC<AIInvestorPrepProps> = ({ idea, onUpdateProject }) => {
    const [answers, setAnswers] = useState<Record<string, string>>(idea.investorPrepAnswers || {});
    const [feedbackState, setFeedbackState] = useState<FeedbackState>({});
    const { lang } = useLanguage();

    const ideaContext = useMemo(() => JSON.stringify({
        projectName: idea.projectName,
        uniqueValueProposition: idea.leanCanvas.uniqueValueProposition,
    }), [idea.projectName, idea.leanCanvas.uniqueValueProposition]);

    const handleAnswerChange = (slideIndex: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [slideIndex]: answer }));
    };

    const handleSaveChanges = () => {
        onUpdateProject({ ...idea, investorPrepAnswers: answers });
        alert("Javoblar muvaffaqiyatli saqlandi!");
    };
    
    const handleGetFeedback = async (slideIndex: number) => {
        const question = idea.pitchDeck[slideIndex]?.investorQuestion;
        const answer = answers[slideIndex];

        if (!question || !answer) {
            alert("Iltimos, avval javobingizni yozing.");
            return;
        }

        setFeedbackState(prev => ({ ...prev, [slideIndex]: { isLoading: true, feedback: null, error: null } }));

        try {
            // FIX: Pass the 'lang' argument to the function call.
            const feedback = await getAnswerFeedback(question, answer, ideaContext, lang);
            setFeedbackState(prev => ({ ...prev, [slideIndex]: { isLoading: false, feedback, error: null } }));
        } catch (e) {
            console.error(e);
            setFeedbackState(prev => ({ ...prev, [slideIndex]: { isLoading: false, feedback: null, error: "Fikr-mulohaza olishda xatolik yuz berdi." } }));
        }
    };


    const slidesWithQuestions = idea.pitchDeck
        .map((slide, index) => ({ ...slide, originalIndex: index }))
        .filter(slide => slide.investorQuestion);

    return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg animate-fade-in max-w-5xl mx-auto">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-cyan-500 dark:text-cyan-400 mb-1">Investorga Tayyorgarlik Markazi</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI tomonidan berilgan eng qiyin savollarga javob tayyorlang va ularni "stress-test"dan o'tkazing.
                    </p>
                </div>
                <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700"
                >
                    Javoblarni Saqlash
                </button>
            </div>
            
            {slidesWithQuestions.length === 0 ? (
                 <div className="text-center py-20">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Hozircha savollar yo'q</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">"AI Investor Simulyatori" bo'limida slaydlarni tahlil qiling va bu yerda savollar paydo bo'ladi.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {slidesWithQuestions.map((slide) => {
                        const index = slide.originalIndex;
                        const currentFeedback = feedbackState[index];

                        return (
                            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <h4 className="font-bold text-gray-800 dark:text-gray-200">Slayd {index + 1}: {slide.title}</h4>
                                <p className="mt-2 text-sm italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                    <span className="font-semibold not-italic">Investor Savoli:</span> "{slide.investorQuestion}"
                                </p>
                                
                                <div className="mt-3">
                                    <textarea
                                        value={answers[index] || ''}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        rows={4}
                                        placeholder="Javobingizni shu yerga yozing..."
                                        className="w-full p-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg border dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
                                    />
                                     <button 
                                        onClick={() => handleGetFeedback(index)} 
                                        disabled={currentFeedback?.isLoading}
                                        className="mt-2 flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-cyan-600 rounded-lg shadow-sm hover:bg-cyan-700 transition-colors disabled:bg-cyan-400"
                                    >
                                        {currentFeedback?.isLoading ? <LoadingSpinner className="w-4 h-4"/> : <SparklesIcon className="w-4 h-4" />}
                                        Fikr Olish (Stress-test)
                                     </button>
                                </div>
                                
                                {currentFeedback && (
                                    <div className="mt-4 p-3 border-t dark:border-gray-600">
                                        {currentFeedback.isLoading && <div className="flex justify-center"><LoadingSpinner/></div>}
                                        {currentFeedback.error && <p className="text-red-500 text-sm">{currentFeedback.error}</p>}
                                        {currentFeedback.feedback && (
                                            <div className="space-y-3 animate-fade-in">
                                                <h5 className="font-semibold text-md text-gray-800 dark:text-gray-200">AI Tahlili</h5>
                                                <div>
                                                     <h6 className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400"><ThumbsUpIcon className="w-4 h-4" />Kuchli Tomonlari</h6>
                                                     <ul className="list-disc list-inside text-sm mt-1 space-y-1">{currentFeedback.feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                                                </div>
                                                <div>
                                                     <h6 className="flex items-center gap-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400"><LightbulbIcon className="w-4 h-4" />Zaif Tomonlari</h6>
                                                     <ul className="list-disc list-inside text-sm mt-1 space-y-1">{currentFeedback.feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
                                                </div>
                                                <div>
                                                     <h6 className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400"><SparklesIcon className="w-4 h-4" />Yaxshilash Uchun Taklif</h6>
                                                     <p className="text-sm mt-1">{currentFeedback.feedback.suggestedImprovement}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};