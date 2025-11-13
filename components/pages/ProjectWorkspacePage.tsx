import React, { useState, useEffect } from 'react';
import type { StartupIdea, OptimizedMonetizationSuggestion, StrategicReview } from '../../types';
import { Sidebar } from '../Sidebar';
import { DownloadIcon } from '../icons/DownloadIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { ChatIcon } from '../icons/ChatIcon';
import { AIMentorChat } from '../AIMentorChat';
import { generateFullBusinessPlanDocx } from '../../services/docGenerator';
import { optimizeMonetizationStrategy, getStrategicReview } from '../../services/geminiService';
import { ProjectCommandCenter } from '../ProjectCommandCenter';
import { LegalPackGenerator } from '../LegalPackGenerator';
import { InvestorPitchRoom } from '../InvestorPitchRoom';
import { MarketTrendRadar } from '../CoFounderMatch';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { MagicWandIcon } from '../icons/MagicWandIcon';
import { LoadingSpinner } from '../icons/LoadingSpinner';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { AIInvestorPrep } from '../AIInvestorPrep';
import { useLanguage } from '../../contexts/LanguageContext';


interface ProjectWorkspacePageProps {
  idea: StartupIdea;
  onBack: () => void;
  onUpdateProject: (updatedProject: StartupIdea) => void;
}

const PricingLabModal: React.FC<{ idea: StartupIdea, onUpdateProject: (idea: StartupIdea) => void, onClose: () => void }> = ({ idea, onUpdateProject, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [suggestion, setSuggestion] = useState<OptimizedMonetizationSuggestion | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { lang } = useLanguage();

    const fetchSuggestion = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await optimizeMonetizationStrategy(idea.competitiveAnalysis, idea.targetAudiencePersonas, idea.monetizationStrategy, lang);
            setSuggestion(result);
        } catch(e) {
            console.error(e);
            setError("Tavsiyalarni yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSuggestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApply = () => {
        if (suggestion) {
            const updatedIdea = {
                ...idea,
                monetizationStrategy: {
                    ...idea.monetizationStrategy,
                    pricingTiers: suggestion.optimizedTiers,
                    justification: `${idea.monetizationStrategy.justification}\n\nAI Optimizatsiyasi Asosi:\n${suggestion.justification}`
                }
            };
            onUpdateProject(updatedIdea);
            onClose();
        }
    };
    
    const renderTiers = (tiers: any[]) => (
        <div className="space-y-3">
            {tiers.map(tier => (
                <div key={tier.name} className={`p-3 rounded-lg ${tier.name.toLowerCase().includes('pro') ? 'border border-cyan-500 bg-cyan-500/10' : 'bg-black/5 dark:bg-white/5'}`}>
                    <h5 className="font-bold">{tier.name}</h5>
                    <p className="font-semibold text-cyan-600 dark:text-cyan-400">{tier.price}</p>
                    <ul className="list-disc list-inside text-xs mt-2 space-y-1">
                        {tier.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                    </ul>
                </div>
            ))}
        </div>
    );


    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div
                className="w-full max-w-4xl glass-panel flex flex-col overflow-hidden max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-500/20 flex justify-between items-center flex-shrink-0">
                     <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">AI Narxlar Laboratoriyasi</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading && <div className="flex flex-col items-center justify-center h-full"><LoadingSpinner className="w-10 h-10 mb-4" /><p>AI strategiyani tahlil qilmoqda...</p></div>}
                    {error && <div className="text-center text-red-500">{error}</div>}
                    {suggestion && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-center mb-2 text-gray-800 dark:text-gray-200">Joriy Strategiya</h4>
                                    {renderTiers(idea.monetizationStrategy.pricingTiers)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-center mb-2 text-cyan-500">AI Tavsiyasi</h4>
                                    {renderTiers(suggestion.optimizedTiers)}
                                </div>
                            </div>
                            <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg">
                                <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">AI Asosi (Justification)</h4>
                                <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">{suggestion.justification}</p>
                            </div>
                        </div>
                    )}
                </div>
                <footer className="p-4 border-t border-gray-500/20 flex-shrink-0 flex justify-end gap-3">
                     <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-full bg-gray-500/20 hover:bg-gray-500/30">Yopish</button>
                     <button onClick={handleApply} disabled={isLoading || !suggestion} className="px-6 py-2 text-sm liquid-button">Tavsiyani Qo'llash</button>
                </footer>
            </div>
        </div>
    );
};


const StrategyReviewModal: React.FC<{ idea: StartupIdea, onClose: () => void }> = ({ idea, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [reviewData, setReviewData] = useState<{ review: StrategicReview; sources: any[] } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { lang } = useLanguage();

    useEffect(() => {
        const fetchReview = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await getStrategicReview(idea, lang);
                setReviewData(result);
            } catch (e) {
                console.error(e);
                setError("Strategik tahlilni yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchReview();
    }, [idea, lang]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div
                className="w-full max-w-4xl glass-panel flex flex-col overflow-hidden max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-500/20 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">AI Strategik Tahlil</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <LoadingSpinner className="w-10 h-10 mb-4 text-blue-500" />
                            <p className="text-gray-700 dark:text-gray-300">AI bozor tendensiyalarini tahlil qilmoqda va strategiyangizni ko'rib chiqmoqda...</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">(Bu jarayon bir daqiqagacha vaqt olishi mumkin)</p>
                        </div>
                    )}
                    {error && <div className="text-center text-red-500 p-8">{error}</div>}
                    {reviewData && (
                        <div className="space-y-6">
                            <div className="p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg">
                                <h4 className="font-semibold text-blue-800 dark:text-blue-200">AI Xulosasi</h4>
                                <p className="italic text-blue-700 dark:text-blue-300 mt-1">"{reviewData.review.summary}"</p>
                            </div>
                            
                            <div className="space-y-4">
                                {reviewData.review.suggestions.map((suggestion, index) => (
                                    <div key={index} className="p-4 border rounded-lg border-gray-500/20">
                                        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/20 mb-2">{suggestion.area}</span>
                                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">Kuzatuv</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{suggestion.observation}</p>
                                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">Tavsiya</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{suggestion.recommendation}</p>
                                    </div>
                                ))}
                            </div>

                            {reviewData.sources && reviewData.sources.length > 0 && (
                                <div className="pt-4 border-t border-gray-500/20">
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><GlobeIcon className="w-5 h-5"/> Manbalar</h4>
                                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                                        {reviewData.sources.map((source: any, index: number) => (
                                            <li key={index}>
                                                <a href={source.web?.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                                                    {source.web?.title || source.web?.uri}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                 <footer className="p-4 border-t border-gray-500/20 flex-shrink-0 flex justify-end">
                     <button onClick={onClose} className="px-6 py-2 text-sm font-medium rounded-full bg-gray-500/20 hover:bg-gray-500/30">Yopish</button>
                </footer>
            </div>
        </div>
    );
};


export const ProjectWorkspacePage: React.FC<ProjectWorkspacePageProps> = ({ idea, onBack, onUpdateProject }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPricingLabOpen, setIsPricingLabOpen] = useState(false);
  const [isStrategyReviewOpen, setIsStrategyReviewOpen] = useState(false);
  const { t } = useLanguage();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
        // FIX: Remove the extra t() function argument as it is not expected.
        const blob = await generateFullBusinessPlanDocx(idea);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Biznes_Reja_${idea.projectName.replace(/\s+/g, '_')}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Hujjatni yuklab olishda xatolik:", error);
        alert("Hujjatni yuklab olishda xatolik yuz berdi.");
    } finally {
        setIsDownloading(false);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardContent idea={idea} onOptimizeClick={() => setIsPricingLabOpen(true)} onOpenStrategyReview={() => setIsStrategyReviewOpen(true)} />; 
      case 'kanban':
        return <ProjectCommandCenter idea={idea} />;
      case 'legal':
        return <LegalPackGenerator idea={idea} />;
      case 'pitch':
        return <InvestorPitchRoom idea={idea} onUpdateProject={onUpdateProject} />;
      case 'investorPrep':
        return <AIInvestorPrep idea={idea} onUpdateProject={onUpdateProject} />;
      case 'radar':
        return <MarketTrendRadar idea={idea} />;
      default:
        return <DashboardContent idea={idea} onOptimizeClick={() => setIsPricingLabOpen(true)} onOpenStrategyReview={() => setIsStrategyReviewOpen(true)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-transparent">
        {isChatOpen && <AIMentorChat idea={idea} onClose={() => setIsChatOpen(false)} />}
        {isPricingLabOpen && <PricingLabModal idea={idea} onUpdateProject={onUpdateProject} onClose={() => setIsPricingLabOpen(false)} />}
        {isStrategyReviewOpen && <StrategyReviewModal idea={idea} onClose={() => setIsStrategyReviewOpen(false)} />}
        
        <header className="flex-shrink-0 p-2 sm:p-4 bg-transparent">
             <div className="glass-panel p-2 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4 min-w-0">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex-shrink-0" title={t('back')}>
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">{idea.projectName}</h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{idea.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button onClick={() => setIsChatOpen(true)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title={t('workspace.chatTooltip')}><ChatIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
                    <button onClick={handleDownload} disabled={isDownloading} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title={t('workspace.downloadTooltip')}><DownloadIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
                    <button className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title={t('workspace.shareTooltip')}><ShareIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
                </div>
            </div>
        </header>

        <div className="px-2 sm:px-4">
            <div className="glass-panel rounded-b-none p-1">
                 <Sidebar activeView={activeView} onViewChange={setActiveView} />
            </div>
        </div>

        <main className="flex-grow overflow-y-auto p-2 sm:p-4 md:p-6">
            {renderActiveView()}
        </main>
    </div>
  );
};


// Create a project-specific dashboard to avoid confusion with the main dashboard
import { GanttChart } from '../GanttChart';
import { FinancialCalculator } from '../FinancialCalculator';
import { ActionableChecklist } from '../ActionableChecklist';

const InfoCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="glass-panel p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-3 border-b pb-2 border-gray-500/20">{title}</h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">{children}</div>
    </div>
);

const RiskBadge: React.FC<{ level: string }> = ({ level }) => {
    const levelLower = level.toLowerCase();
    let levelClasses = 'bg-gray-500/20 text-gray-800 dark:text-gray-400';
    if (['past', 'низкая', 'low'].some(l => levelLower.includes(l))) {
        levelClasses = 'bg-green-500/20 text-green-800 dark:text-green-400';
    } else if (['o\'rta', 'средняя', 'medium'].some(l => levelLower.includes(l))) {
        levelClasses = 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-400';
    } else if (['yuqori', 'высокая', 'high'].some(l => levelLower.includes(l))) {
        levelClasses = 'bg-red-500/20 text-red-800 dark:text-red-400';
    }

    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${levelClasses}`}>{level}</span>
};


const DashboardContent: React.FC<{idea: StartupIdea, onOptimizeClick: () => void, onOpenStrategyReview: () => void}> = ({ idea, onOptimizeClick, onOpenStrategyReview }) => {
    const { t } = useLanguage();
    const { 
        leanCanvas, 
        swotAnalysis, 
        financialProjections, 
        projectRoadmap,
        brandingGuide,
        actionableChecklist,
        competitiveAnalysis,
        targetAudiencePersonas,
        monetizationStrategy,
        teamStructure,
        riskAnalysis,
    } = idea;

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="glass-panel p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3 border-b pb-2 border-gray-500/20">{t('workspace.dashboardContent.strategicReviewTitle')}</h3>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                     <p className="mb-4">{t('workspace.dashboardContent.strategicReviewDesc')}</p>
                    <button
                        onClick={onOpenStrategyReview}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        <ChartBarIcon className="w-5 h-5" />
                        {t('workspace.dashboardContent.startStrategicReview')}
                    </button>
                </div>
            </div>

             <InfoCard title={t('workspace.dashboardContent.uvpTitle')}>
                <p className="text-lg italic text-gray-800 dark:text-gray-100">"{leanCanvas.uniqueValueProposition}"</p>
            </InfoCard>

            <InfoCard title={t('workspace.dashboardContent.personasTitle')}>
                <p className="text-sm mb-4">{targetAudiencePersonas.summary}</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {targetAudiencePersonas.personas.map(persona => (
                        <div key={persona.name} className="p-4 rounded-lg bg-black/5 dark:bg-white/5">
                            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{persona.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{persona.demographics}</p>
                            <p className="italic text-sm mb-3">"{persona.story}"</p>
                            <h5 className="font-semibold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">Maqsadlari:</h5>
                            <ul className="list-disc list-inside text-sm mb-2">{persona.goals.map((g, i) => <li key={i}>{g}</li>)}</ul>
                            <h5 className="font-semibold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">Og'riqli nuqtalari:</h5>
                            <ul className="list-disc list-inside text-sm">{persona.painPoints.map((p, i) => <li key={i}>{p}</li>)}</ul>
                        </div>
                    ))}
                </div>
            </InfoCard>
            
            <InfoCard title={t('workspace.dashboardContent.competitorAnalysisTitle')}>
                <p className="text-sm mb-4">{competitiveAnalysis.marketPositioningStatement}</p>
                <div className="space-y-4">
                    {competitiveAnalysis.competitors.map(comp => (
                         <div key={comp.name} className="p-4 border rounded-lg border-gray-500/20">
                            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{comp.name}</h4>
                            <div className="grid md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <h5 className="font-semibold text-green-600 dark:text-green-400">Kuchli tomonlari:</h5>
                                    <ul className="list-disc list-inside text-sm">{comp.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-red-600 dark:text-red-400">Zaif tomonlari:</h5>
                                    <ul className="list-disc list-inside text-sm">{comp.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
                                </div>
                            </div>
                            <div className="mt-3">
                                <h5 className="font-semibold text-cyan-600 dark:text-cyan-400">Strategiyamiz:</h5>
                                <p className="text-sm">{comp.strategyToBeat}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </InfoCard>

             <div className="glass-panel p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 border-b pb-2 border-gray-500/20 gap-2">
                    <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">{t('workspace.dashboardContent.monetizationTitle')}</h3>
                    <button
                        onClick={onOptimizeClick}
                        className="flex items-center self-start sm:self-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-cyan-600 rounded-full shadow-sm hover:bg-cyan-700 transition-colors flex-shrink-0"
                    >
                        <MagicWandIcon className="w-4 h-4" />
                        {t('workspace.dashboardContent.optimizePrice')}
                    </button>
                </div>
                 <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{monetizationStrategy.primaryModel}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{monetizationStrategy.description}</p>
                    <p className="text-sm mb-4"><span className="font-semibold">Asoslash:</span> {monetizationStrategy.justification}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {monetizationStrategy.pricingTiers.map(tier => (
                            <div key={tier.name} className={`p-4 border-2 rounded-lg flex flex-col ${tier.name.toLowerCase().includes('pro') || tier.name.toLowerCase().includes('standard') ? 'border-cyan-500 bg-cyan-500/10' : 'border-transparent bg-black/5 dark:bg-white/5'}`}>
                                <h5 className="font-bold text-xl text-center text-gray-800 dark:text-gray-200">{tier.name}</h5>
                                <p className="text-2xl font-bold text-center my-2 text-gray-900 dark:text-white">{tier.price}</p>
                                <ul className="list-disc list-inside text-sm space-y-1 mt-4 flex-grow">
                                    {tier.features.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <InfoCard title={t('workspace.dashboardContent.swotTitle')}>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-green-600 dark:text-green-400">Kuchli Tomonlar</h4>
                        <ul className="list-disc list-inside">{swotAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-red-600 dark:text-red-400">Zaif Tomonlar</h4>
                        <ul className="list-disc list-inside">{swotAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-blue-600 dark:text-blue-400">Imkoniyatlar</h4>
                        <ul className="list-disc list-inside">{swotAnalysis.opportunities.map((o, i) => <li key={i}>{o}</li>)}</ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-yellow-600 dark:text-yellow-400">Xavflar</h4>
                        <ul className="list-disc list-inside">{swotAnalysis.threats.map((t, i) => <li key={i}>{t}</li>)}</ul>
                    </div>
                </div>
            </InfoCard>
            
            <InfoCard title={t('workspace.dashboardContent.financialsTitle')}>
                <FinancialCalculator projections={financialProjections} />
            </InfoCard>

             <InfoCard title={t('workspace.dashboardContent.teamTitle')}>
                <p className="text-sm mb-4"><span className="font-semibold">Ishga olish ustuvorligi:</span> {teamStructure.hiringPriorities}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamStructure.roles.map(role => (
                        <div key={role.role} className="p-4 rounded-lg bg-black/5 dark:bg-white/5">
                            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{role.role}</h4>
                            <h5 className="font-semibold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-2">Mas'uliyatlar:</h5>
                            <ul className="list-disc list-inside text-sm">{role.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
                             <h5 className="font-semibold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-2">Ko'nikmalar:</h5>
                            <ul className="list-disc list-inside text-sm">{role.requiredSkills.map((s, i) => <li key={i}>{s}</li>)}</ul>
                        </div>
                    ))}
                </div>
            </InfoCard>

            <InfoCard title={t('workspace.dashboardContent.roadmapTitle')}>
                <GanttChart roadmap={projectRoadmap} />
            </InfoCard>

             <InfoCard title={t('workspace.dashboardContent.risksTitle')}>
                <p className="text-sm mb-4">{riskAnalysis.summary}</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[600px]">
                        <thead className="text-xs text-gray-700 uppercase bg-black/5 dark:bg-white/10 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Risk</th>
                                <th scope="col" className="px-4 py-3">Ehtimollik</th>
                                <th scope="col" className="px-4 py-3">Ta'sir</th>
                                <th scope="col" className="px-4 py-3">Kamaytirish Strategiyasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riskAnalysis.risks.map((risk, index) => (
                                <tr key={index} className="border-b border-gray-500/20">
                                    <td className="px-4 py-3">{risk.description}</td>
                                    <td className="px-4 py-3"><RiskBadge level={risk.likelihood} /></td>
                                    <td className="px-4 py-3"><RiskBadge level={risk.impact} /></td>
                                    <td className="px-4 py-3">{risk.mitigation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </InfoCard>
            
            <InfoCard title={t('workspace.dashboardContent.checklistTitle')}>
                <ActionableChecklist initialChecklist={actionableChecklist} />
            </InfoCard>
            
             <InfoCard title={t('workspace.dashboardContent.brandingTitle')}>
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Ranglar Palitrasi</h4>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {brandingGuide.colorPalette.map(color => (
                            <div key={color.hex} className="text-center">
                                <div className="w-12 h-12 rounded-full border border-gray-500/20" style={{ backgroundColor: color.hex }}></div>
                                <p className="text-xs mt-1">{color.name}</p>
                                <p className="text-xs font-mono">{color.hex}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Tipografiya</h4>
                    <p>{brandingGuide.typography.fontFamily} - {brandingGuide.typography.usage}</p>
                </div>
            </InfoCard>
        </div>
    );
};