import React, { useState } from 'react';
import type { StartupIdea } from '../../types';
import { Sidebar } from '../Sidebar';
import { DownloadIcon } from '../icons/DownloadIcon';
 
import { generateFullBusinessPlanDocx } from '../../services/docGenerator';
import { ProjectCommandCenter } from '../ProjectCommandCenter';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { InvestorPitchRoom } from '../InvestorPitchRoom';
 
 
import { useLanguage } from '../../contexts/LanguageContext';


interface ProjectWorkspacePageProps {
  idea: StartupIdea;
  onBack: () => void;
  onUpdateProject: (updatedProject: StartupIdea) => void;
}

export const ProjectWorkspacePage: React.FC<ProjectWorkspacePageProps> = ({ idea, onBack, onUpdateProject }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isDownloading, setIsDownloading] = useState(false);
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
        return <DashboardContent idea={idea} onOptimizeClick={() => {}} onOpenStrategyReview={() => {}} />; 
      case 'kanban':
        return <ProjectCommandCenter idea={idea} />;
      case 'pitch':
        return <InvestorPitchRoom idea={idea} onUpdateProject={onUpdateProject} />;
      default:
        return <DashboardContent idea={idea} onOptimizeClick={() => {}} onOpenStrategyReview={() => {}} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-transparent">
        
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
                    <button onClick={handleDownload} disabled={isDownloading} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title={t('workspace.downloadTooltip')}><DownloadIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
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
        projectCharter,
        leanCanvas, 
        swotAnalysis, 
        financialProjections, 
        projectRoadmap,
        brandingGuide,
        actionableChecklist,
        competitiveAnalysis,
        monetizationStrategy,
        teamStructure,
        riskAnalysis,
    } = idea;

    return (
        <div className="space-y-6 animate-fade-in">
            <InfoCard title={"Loyiha Nizomi (Project Charter)"}>
                <div className="space-y-3">
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Missiya</h4>
                        <p>{projectCharter?.mission ?? '—'}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Vizyon</h4>
                        <p>{projectCharter?.vision ?? '—'}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Maqsadlar (SMART)</h4>
                        <ul className="list-disc list-inside space-y-1">{(projectCharter?.objectives ?? []).map((o, i) => <li key={i}>{o}</li>)}</ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Scope (Qamrov)</h4>
                        <p>{projectCharter?.scope ?? '—'}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Muvaffaqiyat Metrikalari (KPI)</h4>
                        <ul className="list-disc list-inside space-y-1">{(projectCharter?.successMetrics ?? []).map((m, i) => <li key={i}>{m}</li>)}</ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Boshqaruv (Governance)</h4>
                        <p>{projectCharter?.governance ?? '—'}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Qadriyatlar (Values)</h4>
                        <ul className="list-disc list-inside space-y-1">{(projectCharter?.values ?? []).map((v, i) => <li key={i}>{v}</li>)}</ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Manfaatdor tomonlar (Stakeholders)</h4>
                        <ul className="list-disc list-inside space-y-1">{(projectCharter?.stakeholders ?? []).map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Farazlar (Assumptions)</h4>
                        <ul className="list-disc list-inside space-y-1">{(projectCharter?.assumptions ?? []).map((a, i) => <li key={i}>{a}</li>)}</ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Cheklovlar (Constraints)</h4>
                        <ul className="list-disc list-inside space-y-1">{(projectCharter?.constraints ?? []).map((c, i) => <li key={i}>{c}</li>)}</ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Qamrovdan tashqari (Out of Scope)</h4>
                        <ul className="list-disc list-inside space-y-1">{(projectCharter?.outOfScope ?? []).map((o, i) => <li key={i}>{o}</li>)}</ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Bog'liqliklar (Dependencies)</h4>
                        <ul className="list-disc list-inside space-y-1">{(projectCharter?.dependencies ?? []).map((d, i) => <li key={i}>{d}</li>)}</ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Byudjet Umumiy Ko'rinishi</h4>
                        <p>{projectCharter?.budgetOverview ?? '—'}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Muvaffaqiyat Mezonlari</h4>
                        <ul className="list-disc list-inside space-y-1">{(projectCharter?.successCriteria ?? []).map((m, i) => <li key={i}>{m}</li>)}</ul>
                    </div>
                </div>
            </InfoCard>

            

             <InfoCard title={t('workspace.dashboardContent.uvpTitle')}>
                <p className="text-lg italic text-gray-800 dark:text-gray-100">"{leanCanvas.uniqueValueProposition}"</p>
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
                                <ul className="list-disc list-inside text-sm">{tier.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
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