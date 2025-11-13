
import React, { useState, useEffect, useMemo } from 'react';
import type { ListedProject, StartupIdea } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { SearchIcon } from '../icons/SearchIcon';
import { CashIcon } from '../icons/CashIcon';
import { TagIcon } from '../icons/TagIcon';
import { BuildingStorefrontIcon } from '../icons/BuildingStorefrontIcon';
import { api } from '../../services/api';

const INDUSTRIES = ['E-tijorat', 'AgroTex', 'FinTex', 'Sog\'liqni saqlash', 'Ta\'lim', 'Turizm', 'Media', 'SaaS'];

type ListedWithData = ListedProject & { projectData?: any; founderPhone?: string; founderName?: string };

const ProjectCard: React.FC<{ project: ListedWithData }> = ({ project }) => {
    const { t, lang } = useLanguage();
    const [showContact, setShowContact] = useState(false);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(lang, { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(amount);
    };

    const industry = project.projectData?.leanCanvas?.customerSegments?.[0] || 'Noma\'lum';

    return (
        <div className="glass-panel p-1 transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="bg-gray-800/50 rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
              <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-100 pr-2">{project.projectName}</h3>
                      <span className="flex-shrink-0 text-xs font-medium text-cyan-300 bg-cyan-500/20 py-1 px-2.5 rounded-full flex items-center gap-1">
                          <TagIcon className="w-3 h-3" />
                          {industry}
                      </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-300 line-clamp-4 h-[80px]">
                      {project.pitch}
                  </p>
              </div>
              <div className="p-5 bg-black/20 grid grid-cols-2 gap-4">
                  <div>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><CashIcon className="w-4 h-4"/>{t('marketplace.fundingSought')}</p>
                      <p className="font-semibold text-lg text-green-400">{formatCurrency(project.fundingSought)}</p>
                  </div>
                  <div>
                      <p className="text-xs text-gray-400">% {t('marketplace.equityOffered')}</p>
                      <p className="font-semibold text-lg text-cyan-400">{project.equityOffered}%</p>
                  </div>
              </div>
               <div className="p-3 bg-black/20 text-center">
                  <button onClick={() => setShowContact(true)} className="w-full text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg">
                       {t('marketplace.contact')}
                  </button>
              </div>
          </div>
          {showContact && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4" onClick={() => setShowContact(false)}>
              <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-xl p-5" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{t('marketplace.contact')}</h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div><span className="font-semibold">Ism:</span> <span>{project.founderName || '-'}</span></div>
                  <div><span className="font-semibold">Telefon:</span> <a className="text-cyan-600 dark:text-cyan-400" href={`tel:${project.founderPhone || ''}`}>{project.founderPhone || '-'}</a></div>
                </div>
                <div className="mt-4 flex gap-2 justify-end">
                  <a href={`tel:${project.founderPhone || ''}`} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm">Qo'ng'iroq qilish</a>
                  <button onClick={() => setShowContact(false)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm">Yopish</button>
                </div>
              </div>
            </div>
          )}
        </div>
    );
};

export const InvestorMarketplacePage: React.FC = () => {
    const [listedProjects, setListedProjects] = useState<ListedWithData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState('All');
    const [fundingFilter, setFundingFilter] = useState('All');
    const { t } = useLanguage();
    const fundingRanges = t('marketplace.fundingRanges');

    useEffect(() => {
        (async () => {
            try {
                const resp = await api.listListings(true);
                const mapped: ListedWithData[] = (resp as any[]).map(it => ({
                    projectId: String(it.projectId),
                    projectName: it.projectName,
                    description: it.description,
                    fundingSought: Number(it.funding_sought),
                    equityOffered: Number(it.equity_offered),
                    pitch: it.pitch,
                    founderEmail: it.founderPhone,
                    founderPhone: it.founderPhone,
                    founderName: it.founderName,
                    projectData: it.project_data,
                }));
                setListedProjects(mapped);
            } catch (e) {
                console.error(e);
                setListedProjects([]);
            }
        })();
    }, []);

    const filteredProjects = useMemo(() => {
        return listedProjects.filter(project => {
            const industry = project.projectData?.leanCanvas?.customerSegments?.[0] || '';
            
            // Search term
            const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Industry filter
            const matchesIndustry = industryFilter === 'All' || industry === industryFilter;
            
            // Funding filter
            const funding = project.fundingSought;
            let matchesFunding = false;
            switch(fundingFilter) {
                case fundingRanges[0]: // All
                    matchesFunding = true;
                    break;
                case fundingRanges[1]: // Up to 100M
                    matchesFunding = funding <= 100000000;
                    break;
                case fundingRanges[2]: // 100M - 500M
                    matchesFunding = funding > 100000000 && funding <= 500000000;
                    break;
                case fundingRanges[3]: // 500M - 1B
                    matchesFunding = funding > 500000000 && funding <= 1000000000;
                    break;
                case fundingRanges[4]: // 1B+
                    matchesFunding = funding > 1000000000;
                    break;
                default:
                    matchesFunding = true;
            }

            return matchesSearch && matchesIndustry && matchesFunding;
        });
    }, [listedProjects, searchTerm, industryFilter, fundingFilter, fundingRanges]);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-100">{t('marketplace.title')}</h1>
                <p className="mt-1 text-gray-400 max-w-2xl mx-auto">{t('marketplace.subtitle')}</p>
            </div>

            {/* Filters */}
            <div className="mb-8 p-4 glass-panel flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full sm:flex-1">
                    <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('marketplace.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full ios-input pl-10 p-2.5"
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} className="w-full ios-input p-2.5">
                        <option value="All">{t('all')} {t('marketplace.filterIndustry')}</option>
                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
                <div className="w-full sm:w-auto">
                     <select value={fundingFilter} onChange={e => setFundingFilter(e.target.value)} className="w-full ios-input p-2.5">
                        {fundingRanges.map((r:string) => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>


            {listedProjects.length === 0 ? (
                <div className="text-center py-20 glass-panel">
                    <BuildingStorefrontIcon className="w-16 h-16 mx-auto text-gray-500"/>
                    <h2 className="mt-4 text-xl font-semibold text-gray-200">{t('marketplace.noProjectsTitle')}</h2>
                    <p className="mt-2 text-gray-400">{t('marketplace.noProjectsSubtitle')}</p>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-20 glass-panel">
                    <SearchIcon className="w-16 h-16 mx-auto text-gray-500"/>
                    <h2 className="mt-4 text-xl font-semibold text-gray-200">{t('marketplace.noProjectsFound')}</h2>
                    <p className="mt-2 text-gray-400">{t('marketplace.noProjectsFoundDesc')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProjects.map(project => (
                        <ProjectCard key={project.projectId} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
};
