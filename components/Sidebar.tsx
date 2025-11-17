import React from 'react';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface ResultNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const NavButton: React.FC<{ item: { id: string, label: string, icon: React.FC<any> }, active: boolean, onClick: () => void }> = ({ item, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-shrink-0 flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors border-b-2 rounded-t-md ${
        active
            ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
            : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
        }`}
    >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <span className="truncate hidden sm:inline">{item.label}</span>
    </button>
);

export const Sidebar: React.FC<ResultNavProps> = ({ activeView, onViewChange }) => {
  const { t } = useLanguage();
  
  const mainItems = [
    { id: 'dashboard', label: t('workspace.nav.dashboard'), icon: BrainCircuitIcon },
    { id: 'kanban', label: t('workspace.nav.kanban'), icon: SparklesIcon },
    { id: 'pitch', label: t('workspace.nav.pitch'), icon: MicrophoneIcon },
  ];

  const acceleratorTools: any[] = [];

  return (
    <div className="w-full">
        <nav className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto px-4 sm:px-6 lg:px-8">
            {mainItems.map(item => (
                <NavButton key={item.id} item={item} active={activeView === item.id} onClick={() => onViewChange(item.id)} />
            ))}
            
        </nav>
    </div>
  );
};