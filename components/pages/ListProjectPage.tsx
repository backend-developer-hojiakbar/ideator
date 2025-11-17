
import React, { useState, useMemo } from 'react';
import type { StartupIdea, User, ListedProject } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { TagIcon } from '../icons/TagIcon';
import { CashIcon } from '../icons/CashIcon';
import { api } from '../../services/api';

interface ListProjectPageProps {
    projects: StartupIdea[];
    user: User;
}

const ProjectPreviewCard: React.FC<{ project?: ListedProject, selectedIdea?: StartupIdea, lang: string }> = ({ project, selectedIdea, lang }) => {
    const { t } = useLanguage();

    const formatCurrency = (amount: number) => {
      if (isNaN(amount)) return '-';
      return new Intl.NumberFormat(lang, { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(amount);
    };

    const projectName = project?.projectName || selectedIdea?.projectName || "Loyiha Nomi";
    const pitch = project?.pitch || "Investor uchun qisqacha, jozibador pitch matni shu yerda paydo bo'ladi...";
    const fundingSought = project?.fundingSought || 0;
    const equityOffered = project?.equityOffered || 0;
    const industry = selectedIdea?.leanCanvas.customerSegments[0] || 'Soha';
    
    return (
        <div className="glass-panel p-1 w-full max-w-sm mx-auto">
          <div className="bg-gray-800/50 rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
              <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-100 pr-2">{projectName}</h3>
                      <span className="flex-shrink-0 text-xs font-medium text-cyan-300 bg-cyan-500/20 py-1 px-2.5 rounded-full flex items-center gap-1">
                          <TagIcon className="w-3 h-3" />
                          {industry}
                      </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-300 line-clamp-4 h-[80px]">
                      {pitch}
                  </p>
              </div>
              <div className="p-5 bg-black/20 grid grid-cols-2 gap-4">
                  <div>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><CashIcon className="w-4 h-4"/>{t('marketplace.fundingSought')}</p>
                      <p className="font-semibold text-lg text-green-400">{formatCurrency(fundingSought)}</p>
                  </div>
                  <div>
                      <p className="text-xs text-gray-400">% {t('marketplace.equityOffered')}</p>
                      <p className="font-semibold text-lg text-cyan-400">{equityOffered}%</p>
                  </div>
              </div>
               <div className="p-3 bg-black/20 text-center">
                   <button className="w-full text-sm font-medium text-white bg-cyan-600 px-4 py-2 rounded-lg" disabled>
                       {t('marketplace.contact')}
                   </button>
              </div>
          </div>
        </div>
    );
};


export const ListProjectPage: React.FC<ListProjectPageProps> = ({ projects, user }) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [fundingSought, setFundingSought] = useState('');
    const [equityOffered, setEquityOffered] = useState('');
    const [pitch, setPitch] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { t, lang } = useLanguage();

    const selectedIdea = useMemo(() => {
        return projects.find(p => p.id === selectedProjectId);
    }, [selectedProjectId, projects]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedProjectId || !fundingSought || !equityOffered || !pitch) {
            setError(t('listProject.errorAllFields'));
            return;
        }

        if (!selectedIdea) {
            setError(t('listProject.errorNotFound'));
            return;
        }

        (async () => {
            try {
                await api.createListing({
                    project: Number(selectedIdea.id),
                    funding_sought: Number(fundingSought),
                    equity_offered: Number(equityOffered),
                    pitch,
                } as any);
                setSuccess(t('listProject.successMessage', selectedIdea.projectName));
                setSelectedProjectId('');
                setFundingSought('');
                setEquityOffered('');
                setPitch('');
            } catch (err) {
                console.error(err);
                setError(t('listProject.errorAlreadyListed'));
            }
        })();
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header (fixed height) */}
            <div className="flex-shrink-0 p-3 sm:p-4">
                <div className="text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-100">{t('listProject.title')}</h1>
                    <p className="mt-1 text-gray-400 max-w-2xl mx-auto">{t('listProject.subtitle')}</p>
                </div>
            </div>

            {/* Body (fills available height, no page scroll) */}
            <div className="flex-1 overflow-hidden px-3 sm:px-4 lg:px-6">
                <div className="h-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* Form Section */}
                    <div className="lg:w-2/3 h-full overflow-hidden">
                        <div className="glass-panel p-4 sm:p-6 h-full flex flex-col">
                            <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-100 flex-shrink-0">{t('listProject.formTitle')}</h2>
                            {projects.length === 0 ? (
                                <div className="text-center py-6 sm:py-10 overflow-auto">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-200">{t('listProject.noProjects')}</h2>
                                    <p className="mt-2 text-gray-400">{t('listProject.noProjectsDesc')}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 flex-1 overflow-y-auto pr-1">
                                    <div>
                                        <label htmlFor="project-select" className="block text-sm font-medium text-gray-300">{t('listProject.selectProject')}</label>
                                        <select
                                            id="project-select"
                                            value={selectedProjectId}
                                            onChange={(e) => setSelectedProjectId(e.target.value)}
                                            className="mt-1 block w-full ios-input p-3"
                                        >
                                            <option value="" disabled>{t('listProject.selectProjectPlaceholder')}</option>
                                            {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label htmlFor="funding" className="block text-sm font-medium text-gray-300">{t('listProject.fundingLabel')}</label>
                                            <input type="number" id="funding" value={fundingSought} onChange={e => setFundingSought(e.target.value)} className="mt-1 w-full ios-input p-3" />
                                        </div>
                                        <div>
                                            <label htmlFor="equity" className="block text-sm font-medium text-gray-300">{t('listProject.equityLabel')}</label>
                                            <input type="number" id="equity" min="0" max="100" value={equityOffered} onChange={e => setEquityOffered(e.target.value)} className="mt-1 w-full ios-input p-3" />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="pitch" className="block text-sm font-medium text-gray-300">{t('listProject.pitchLabel')}</label>
                                        <textarea id="pitch" value={pitch} onChange={e => setPitch(e.target.value)} rows={6} className="mt-1 w-full ios-input p-3" placeholder={t('listProject.pitchPlaceholder')}></textarea>
                                    </div>

                                    {error && <p className="text-sm text-red-400">{error}</p>}
                                    {success && <p className="text-sm text-green-400">{success}</p>}

                                    <div className="pb-2">
                                        <button
                                            type="submit"
                                            disabled={!selectedProjectId}
                                            className="w-full flex justify-center py-3 px-4 liquid-button disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t('listProject.submitButton')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:w-1/3 h-full overflow-hidden">
                        <div className="h-full glass-panel p-4 sm:p-6 flex flex-col overflow-hidden">
                            <h2 className="text-lg sm:text-xl font-bold mb-3 text-center text-gray-100 flex-shrink-0">{t('listProject.previewTitle')}</h2>
                            <div className="flex-1 overflow-y-auto pr-1">
                                <ProjectPreviewCard 
                                    project={{
                                        fundingSought: Number(fundingSought),
                                        equityOffered: Number(equityOffered),
                                        pitch,
                                        projectName: selectedIdea?.projectName || t('listProject.previewTitle'),
                                        projectId: selectedIdea?.id || '',
                                        description: selectedIdea?.description || '',
                                        founderEmail: user.email,
                                    }}
                                    selectedIdea={selectedIdea}
                                    lang={lang}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
