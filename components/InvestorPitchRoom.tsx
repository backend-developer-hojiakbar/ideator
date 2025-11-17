import React, { useState, useMemo } from 'react';
import type { StartupIdea, PitchDeckSlide, PitchDeckSlideSuggestion } from '../types';
import { rewritePitchDeckSlide } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { useLanguage } from '../contexts/LanguageContext';

const RewriteSuggestionModal: React.FC<{
    originalSlide: PitchDeckSlide;
    suggestion: PitchDeckSlideSuggestion;
    onApply: () => void;
    onClose: () => void;
}> = ({ originalSlide, suggestion, onApply, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b dark:border-gray-700">
                    <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">AI Slayd Yordamchisi</h3>
                </header>
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div>
                        <h4 className="font-semibold text-center mb-2">Original</h4>
                        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 h-full">
                            <h5 className="text-xl font-bold text-center mb-3">{originalSlide.title}</h5>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                {originalSlide.content.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    </div>
                    {/* Suggestion */}
                    <div>
                        <h4 className="font-semibold text-center mb-2 text-cyan-500">AI Taklifi</h4>
                        <div className="bg-cyan-500/10 border border-cyan-500/50 rounded-lg p-4 h-full">
                            <h5 className="text-xl font-bold text-center mb-3">{suggestion.rewrittenTitle}</h5>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                {suggestion.rewrittenContent.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t dark:border-gray-700 space-y-3">
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">AI Izohi</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{suggestion.justification}</p>
                    </div>
                    <div>
                         <h4 className="font-semibold text-gray-800 dark:text-gray-200">AI Vizual Taklifi</h4>
                         <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{suggestion.visualSuggestion}</p>
                    </div>
                </div>
                <footer className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-300 dark:bg-gray-600">Bekor qilish</button>
                    <button onClick={onApply} className="px-6 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700">Qo'llash</button>
                </footer>
            </div>
        </div>
    );
};

 


interface InvestorPitchRoomProps {
  idea: StartupIdea;
  onUpdateProject: (updatedIdea: StartupIdea) => void;
}

export const InvestorPitchRoom: React.FC<InvestorPitchRoomProps> = ({ idea, onUpdateProject }) => {
    const [pitchDeck, setPitchDeck] = useState(idea.pitchDeck);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const [isRewriting, setIsRewriting] = useState(false);
    const [suggestion, setSuggestion] = useState<PitchDeckSlideSuggestion | null>(null);
    const { lang } = useLanguage();

    const ideaContext = useMemo(() => JSON.stringify({
        projectName: idea.projectName,
        uniqueValueProposition: idea.leanCanvas.uniqueValueProposition,
    }), [idea.projectName, idea.leanCanvas.uniqueValueProposition]);

    

    const handleRewrite = async () => {
        setIsRewriting(true);
        setSuggestion(null);
        try {
            // FIX: Pass the 'lang' argument to the function call.
            const result = await rewritePitchDeckSlide(pitchDeck[currentSlideIndex], ideaContext, lang);
            setSuggestion(result);
        } catch (e) {
            console.error("Failed to rewrite slide", e);
        } finally {
            setIsRewriting(false);
        }
    };
    
    const handleApplySuggestion = () => {
        if (suggestion) {
            const newPitchDeck = [...pitchDeck];
            newPitchDeck[currentSlideIndex] = {
                title: suggestion.rewrittenTitle,
                content: suggestion.rewrittenContent,
                visualSuggestion: suggestion.visualSuggestion,
            };
            setPitchDeck(newPitchDeck);
            onUpdateProject({ ...idea, pitchDeck: newPitchDeck });
            setSuggestion(null);
        }
    };

  const currentSlide = pitchDeck[currentSlideIndex];

  return (
    <div className="p-0 sm:p-4 bg-gray-100 dark:bg-gray-900 rounded-lg h-full flex flex-col">
        {suggestion && <RewriteSuggestionModal originalSlide={pitchDeck[currentSlideIndex]} suggestion={suggestion} onApply={handleApplySuggestion} onClose={() => setSuggestion(null)} />}
        
        <h3 className="text-xl font-bold text-cyan-500 dark:text-cyan-400 mb-4 flex-shrink-0 px-4 sm:px-0">Pitch Deck Boshqaruv Markazi</h3>
        
        <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
            {/* Center Panel: Slide Viewer - order-1 on mobile */}
            <div className="w-full md:w-1/2 flex-1 bg-gray-900 dark:bg-black rounded-lg flex flex-col text-white relative shadow-lg md:order-2">
                 <p className="absolute top-4 left-4 text-sm text-gray-400">{currentSlideIndex + 1} / {pitchDeck.length}</p>
                 <div className="flex-1 flex flex-col justify-center items-center text-center p-4 overflow-y-auto">
                    <h4 className="text-2xl md:text-3xl font-bold mb-6">{currentSlide.title}</h4>
                    <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-gray-300">
                        {currentSlide.content.map((point, index) => <li key={index}>{point}</li>)}
                    </ul>
                </div>
                <div className="flex-shrink-0 p-3 flex justify-between items-center gap-4 bg-black/20">
                    <div className="flex items-center gap-2 text-xs text-gray-400 min-w-0" title="Vizual tavsiya">
                        {currentSlide.visualSuggestion && <>
                            <LightbulbIcon className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                            <span className="truncate">{currentSlide.visualSuggestion}</span>
                        </>}
                    </div>
                    <button onClick={handleRewrite} disabled={isRewriting} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-cyan-600 rounded-full shadow-sm hover:bg-cyan-700 transition-colors disabled:bg-cyan-400 flex-shrink-0">
                         {isRewriting ? <LoadingSpinner className="w-4 h-4" /> : <MagicWandIcon className="w-4 h-4" />}
                        <span>Yaxshilash</span>
                    </button>
                </div>
            </div>

            {/* Left Panel: Slide List - order-2 on mobile */}
            <div className="w-full md:w-1/4 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-2 overflow-y-auto md:order-1 h-40 md:h-auto">
                <div className="space-y-1">
                    {pitchDeck.map((slide, index) => (
                        <button 
                            key={index}
                            onClick={() => setCurrentSlideIndex(index)}
                            className={`w-full text-left p-2 rounded-md text-sm transition-colors ${currentSlideIndex === index ? 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200 font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {index + 1}. {slide.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Panel removed as requested */}

        </div>
    </div>
  );
};