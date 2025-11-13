import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { StartupIdea, PitchDeckSlide, PitchDeckSlideSuggestion, AISlideAnalysis, AIPitchHealthCheck } from '../types';
import { getAiSlideAnalysis, getAiPitchHealthCheck, rewritePitchDeckSlide } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { CheckIcon } from './icons/CheckIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { QuestionMarkIcon } from './icons/QuestionMarkIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { TargetIcon } from './icons/TargetIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { RefreshIcon } from './icons/RefreshIcon';
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

const AnalysisSection: React.FC<{ icon: React.FC<any>, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div>
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
            <Icon className="w-5 h-5 text-cyan-500" />
            <span>{title}</span>
        </h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 pl-7 space-y-1">{children}</div>
    </div>
);


interface InvestorPitchRoomProps {
  idea: StartupIdea;
  onUpdateProject: (updatedIdea: StartupIdea) => void;
}

type InvestorPersona = "Shavqatsiz Analitik" | "Mahsulotga Oshiq Visioner" | "O‘sishga Qaram Marketolog";
type ActiveTab = 'slide' | 'health';

export const InvestorPitchRoom: React.FC<InvestorPitchRoomProps> = ({ idea, onUpdateProject }) => {
    const [pitchDeck, setPitchDeck] = useState(idea.pitchDeck);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [persona, setPersona] = useState<InvestorPersona>("Shavqatsiz Analitik");
    const [activeTab, setActiveTab] = useState<ActiveTab>('slide');

    const [slideAnalysis, setSlideAnalysis] = useState<AISlideAnalysis | null>(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

    const [healthCheck, setHealthCheck] = useState<AIPitchHealthCheck | null>(null);
    const [isLoadingHealthCheck, setIsLoadingHealthCheck] = useState(false);

    const [isRewriting, setIsRewriting] = useState(false);
    const [suggestion, setSuggestion] = useState<PitchDeckSlideSuggestion | null>(null);
    const { lang } = useLanguage();

    const ideaContext = useMemo(() => JSON.stringify({
        projectName: idea.projectName,
        uniqueValueProposition: idea.leanCanvas.uniqueValueProposition,
    }), [idea.projectName, idea.leanCanvas.uniqueValueProposition]);

    const handleFetchSlideAnalysis = useCallback(async () => {
        setIsLoadingAnalysis(true);
        setSlideAnalysis(null);
        try {
            const currentSlide = pitchDeck[currentSlideIndex];
            const slideContent = `${currentSlide.title}: ${currentSlide.content.join('; ')}`;
            // FIX: Pass the 'lang' argument to the function call.
            const response = await getAiSlideAnalysis(persona, slideContent, ideaContext, lang);
            setSlideAnalysis(response);
            
            // Persist the generated question
            if (response.investorQuestion) {
                 const newPitchDeck = [...pitchDeck];
                 newPitchDeck[currentSlideIndex].investorQuestion = response.investorQuestion;
                 onUpdateProject({ ...idea, pitchDeck: newPitchDeck });
                 setPitchDeck(newPitchDeck);
            }

        } catch (error) {
            console.error("AI Slide Analysis Error:", error);
        } finally {
            setIsLoadingAnalysis(false);
        }
    }, [currentSlideIndex, persona, pitchDeck, ideaContext, lang, idea, onUpdateProject]);
    
    useEffect(() => {
        handleFetchSlideAnalysis();
    }, [handleFetchSlideAnalysis]);
    
    const handleFetchHealthCheck = useCallback(async () => {
        setIsLoadingHealthCheck(true);
        setHealthCheck(null);
        try {
            const fullDeckContent = pitchDeck.map(s => `Sarlavha: ${s.title}\nMazmuni: ${s.content.join(', ')}`).join('\n---\n');
            // FIX: Pass the 'lang' argument to the function call.
            const response = await getAiPitchHealthCheck(fullDeckContent, ideaContext, lang);
            setHealthCheck(response);
        } catch (error) {
            console.error("AI Health Check Error:", error);
        } finally {
            setIsLoadingHealthCheck(false);
        }
    }, [pitchDeck, ideaContext, lang]);

    useEffect(() => {
        if (activeTab === 'health' && !healthCheck && !isLoadingHealthCheck) {
            handleFetchHealthCheck();
        }
    }, [activeTab, healthCheck, isLoadingHealthCheck, handleFetchHealthCheck]);

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

            {/* Right Panel: AI Analysis - order-3 on mobile */}
            <div className="w-full md:w-1/4 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg flex flex-col overflow-hidden md:order-3">
                <div className="p-3 border-b dark:border-gray-700 flex-shrink-0">
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                        <button onClick={() => setActiveTab('slide')} className={`w-1/2 py-1 text-sm font-medium rounded ${activeTab === 'slide' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Slayd Tahlili</button>
                        <button onClick={() => setActiveTab('health')} className={`w-1/2 py-1 text-sm font-medium rounded ${activeTab === 'health' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Umumiy Tahlil</button>
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {activeTab === 'slide' ? (
                        <>
                            <select value={persona} onChange={(e) => setPersona(e.target.value as InvestorPersona)} className="w-full p-2 text-sm bg-gray-50 border dark:bg-gray-700 dark:border-gray-600 rounded-md">
                                <option>Shavqatsiz Analitik</option>
                                <option>Mahsulotga Oshiq Visioner</option>
                                <option>O‘sishga Qaram Marketolog</option>
                            </select>
                            {isLoadingAnalysis ? <div className="flex justify-center pt-10"><LoadingSpinner/></div> : slideAnalysis ? (
                                <div className="space-y-5">
                                    <AnalysisSection icon={TargetIcon} title="Asosiy Xabar"><p className="italic">"{slideAnalysis.keyMessage}"</p></AnalysisSection>
                                    <AnalysisSection icon={ThumbsUpIcon} title="Kuchli Tomonlari"><ul className="list-disc list-inside">{slideAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></AnalysisSection>
                                    <AnalysisSection icon={LightbulbIcon} title="Yaxshilash Uchun"><ul className="list-disc list-inside">{slideAnalysis.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul></AnalysisSection>
                                    <AnalysisSection icon={ChartBarIcon} title="Vizual Tavsiya"><p>{slideAnalysis.visualSuggestion}</p></AnalysisSection>
                                    <AnalysisSection icon={QuestionMarkIcon} title="Investor Savoli"><p className="font-semibold italic">"{slideAnalysis.investorQuestion}"</p></AnalysisSection>
                                </div>
                            ) : <p>Tahlil yuklanmadi.</p>}
                        </>
                    ) : (
                        <>
                           <div className="flex justify-center items-center gap-2">
                                <h3 className="font-bold text-center text-gray-800 dark:text-gray-200">Taqdimot Salomatligi</h3>
                                {!isLoadingHealthCheck && healthCheck && (
                                    <button onClick={handleFetchHealthCheck} title="Tahlilni yangilash" className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <RefreshIcon className="w-4 h-4 text-gray-500" />
                                    </button>
                                )}
                            </div>
                           {isLoadingHealthCheck || !healthCheck ? (
                               <div className="flex flex-col items-center justify-center pt-10 text-center">
                                   <LoadingSpinner/>
                                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Taqdimot salomatligi tahlil qilinmoqda...</p>
                               </div>
                           ) : (
                               <div className="space-y-4">
                                   <div>
                                      <div className="flex justify-between mb-1"><span className="text-base font-medium">Tayyorgarlik Reytingi</span><span className="text-sm font-medium">{healthCheck.readinessScore}/100</span></div>
                                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"><div className="bg-green-500 h-2.5 rounded-full" style={{width: `${healthCheck.readinessScore}%`}}></div></div>
                                   </div>
                                   <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                       <h4 className="font-semibold text-sm mb-1">AI Xulosasi</h4>
                                       <p className="text-sm italic">"{healthCheck.summary}"</p>
                                   </div>
                                    <div><h4 className="font-semibold text-sm">Eng Kuchli Slaydlar:</h4><ul className="list-disc list-inside text-sm">{healthCheck.strongestSlides.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                                    <div><h4 className="font-semibold text-sm">E'tibor Talab Slaydlar:</h4><ul className="list-disc list-inside text-sm">{healthCheck.weakestSlides.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                                    <div><h4 className="font-semibold text-sm">Strategik Tavsiyalar:</h4><ul className="list-disc list-inside text-sm">{healthCheck.strategicRecommendations.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                               </div>
                           )}
                        </>
                    )}
                </div>
            </div>

        </div>
    </div>
  );
};