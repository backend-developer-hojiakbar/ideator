import React from 'react';
import type { StartupIdea } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';
import { useLanguage } from '../../contexts/LanguageContext';

interface DashboardPageProps {
  projects: StartupIdea[];
  onNavigateToProject: (project: StartupIdea) => void;
  onStartNewProject: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ projects, onNavigateToProject, onStartNewProject }) => {
    const { t } = useLanguage();
    
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{t('dashboard.title')}</h1>
                <button 
                    onClick={onStartNewProject}
                    className="flex items-center gap-2 px-5 py-2 liquid-button text-sm"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    <span>{t('dashboard.newIdeaButton')}</span>
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 glass-panel">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{t('dashboard.noProjectsTitle')}</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">{t('dashboard.noProjectsSubtitle')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div 
                            key={project.id}
                            onClick={() => onNavigateToProject(project)}
                            className="glass-panel p-6 cursor-pointer hover:border-cyan-400/80 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">{project.projectName}</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3 h-16">{project.description}</p>
                             <div className="mt-4 pt-4 border-t border-gray-500/20">
                                <span className="text-xs font-medium text-cyan-800 dark:text-cyan-300 bg-cyan-500/20 py-1 px-2.5 rounded-full">{project.leanCanvas.customerSegments[0]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};