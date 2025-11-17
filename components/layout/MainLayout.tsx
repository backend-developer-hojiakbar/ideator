

import React, { useState, useRef, useEffect } from 'react';
import type { User, StartupIdea, Notification } from '../../types';
import { Page } from '../../App';
import { LogoutIcon } from '../icons/LogoutIcon';
import { WalletIcon } from '../icons/WalletIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { BuildingStorefrontIcon } from '../icons/BuildingStorefrontIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { DashboardPage } from '../pages/DashboardPage';
import { InvestorMarketplacePage } from '../pages/InvestorMarketplacePage';
import { PartnersPage } from '../pages/PartnersPage';
import { AnnouncementsPage } from '../pages/AnnouncementsPage';
import { ListProjectPage } from '../pages/ListProjectPage';
import { AccountPage } from '../pages/AccountPage';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { BellIcon } from '../icons/BellIcon';
import { CheckIcon } from '../icons/CheckIcon';


interface MainLayoutProps {
    user: User;
    onLogout: () => void;
    onNavigate: (page: Page, project?: StartupIdea) => void;
    projects: StartupIdea[];
    activePage: Page;
    notifications: Notification[];
    onMarkNotificationsRead: () => void;
}

const NavItem: React.FC<{ label: string, icon: React.FC<any>, isActive: boolean, onClick: () => void }> = ({ label, icon: Icon, isActive, onClick}) => (
    <button 
      onClick={onClick} 
      className={`flex items-center justify-center sm:justify-start gap-2 h-10 w-10 sm:w-auto sm:px-4 rounded-lg transition-all duration-300 flex-shrink-0 ${
        isActive 
          ? 'bg-white/10 dark:bg-white/10 border border-white/30 text-white shadow-sm' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10 hover:border hover:border-white/20'
      }`}
    >
        <Icon className={`w-5 h-5 transition-colors flex-shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
        <span className="hidden sm:inline">{label}</span>
    </button>
);

const NotificationPanel: React.FC<{ 
    notifications: Notification[], 
    onClose: () => void,
    onMarkAsRead: () => void,
}> = ({ notifications, onClose, onMarkAsRead }) => {
    const { t } = useLanguage();
    const panelRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={panelRef} className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel border border-gray-700 z-30">
             <div className="p-3 flex justify-between items-center border-b border-gray-700">
                <h4 className="font-semibold text-gray-100">{t('notifications')}</h4>
                <button onClick={onMarkAsRead} className="text-xs text-cyan-400 hover:underline">{t('markAsRead')}</button>
            </div>
            {notifications.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">{t('noNotifications')}</p>
            ) : (
                <div className="max-h-96 overflow-y-auto">
                    {notifications.map(n => (
                        <div key={n.id} className={`p-3 border-b border-gray-700/50 ${!n.read ? 'bg-cyan-500/10' : ''}`}>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 flex-shrink-0">
                                    {n.type === 'success' && <CheckIcon className="w-5 h-5 text-green-400" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-100">{n.title}</p>
                                    <p className="text-xs text-gray-300">{n.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout, onNavigate, projects, activePage, notifications, onMarkNotificationsRead }) => {
    const { t } = useLanguage();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    
    const unreadCount = notifications.filter(n => !n.read).length;

    const navItems = [
        { id: 'dashboard', label: t('mainLayout.navDashboard'), icon: SparklesIcon },
        { id: 'listProject', label: t('mainLayout.navLister'), icon: DocumentTextIcon },
        { id: 'investorMarketplace', label: t('mainLayout.navMarketplace'), icon: BuildingStorefrontIcon },
        { id: 'announcements', label: t('mainLayout.navAnnouncements'), icon: DocumentTextIcon },
        { id: 'partners', label: t('mainLayout.navPartners'), icon: BuildingStorefrontIcon },
        { id: 'account', label: t('mainLayout.navAccount'), icon: WalletIcon },
    ];

    const handleNavigateToProject = (project: StartupIdea) => {
        onNavigate('projectWorkspace', project);
    };

    const handleStartNewProject = () => {
        // Prevent starting without sufficient funds (10,000)
        if (user.balance < 10000) {
            alert(t('configStep.insufficientFunds'));
            onNavigate('topUp');
            return;
        }
        onNavigate('newProjectConfig');
    };
    
    const renderActivePage = () => {
        switch(activePage) {
            case 'dashboard':
                return <DashboardPage projects={projects} onNavigateToProject={handleNavigateToProject} onStartNewProject={handleStartNewProject} />;
            case 'investorMarketplace':
                return <InvestorMarketplacePage />;
            case 'announcements':
                return <AnnouncementsPage />;
            case 'partners':
                return <PartnersPage />;
            case 'listProject':
                return <ListProjectPage projects={projects} user={user} />;
            case 'account':
                return <AccountPage />;
            default:
                 return <DashboardPage projects={projects} onNavigateToProject={handleNavigateToProject} onStartNewProject={handleStartNewProject} />;
        }
    }

    return (
        <div className="flex flex-col h-screen bg-transparent">
            {/* New Top Header */}
            <header className="p-2 sm:p-4 flex-shrink-0 z-10">
                <div className="glass-panel flex items-center justify-between p-2 rounded-full shadow-lg">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-2 pl-2 sm:pl-4 flex-shrink-0">
                        <SparklesIcon className="w-6 h-6 text-cyan-500" />
                        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 hidden sm:block">{t('auth.title')}</h1>
                    </div>
                    {/* Center: Nav */}
                    <nav className="flex-1 flex justify-center min-w-0 px-1 sm:px-2">
                        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full">
                            {navItems.map(item => (
                                <NavItem 
                                    key={item.id}
                                    label={item.label}
                                    icon={item.icon}
                                    isActive={activePage === item.id}
                                    onClick={() => onNavigate(item.id as Page)}
                                />
                            ))}
                        </div>
                    </nav>
                    {/* Right: User actions */}
                    <div className="flex items-center gap-1 sm:gap-2 pr-1">
                         <div className="hidden md:flex items-center gap-2 p-2 rounded-full bg-green-500/10 dark:bg-green-500/20">
                            <WalletIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="font-semibold text-sm text-green-700 dark:text-green-300">{t('mainLayout.balance', user.balance.toLocaleString())}</span>
                             <button onClick={() => onNavigate('topUp')} className="text-xs bg-green-500 text-white w-5 h-5 rounded-full hover:bg-green-600 flex items-center justify-center" title={t('mainLayout.topUp')}>+</button>
                        </div>
                        <LanguageSwitcher />
                        <div className="relative">
                            <button onClick={() => setIsNotificationsOpen(prev => !prev)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 relative" title={t('notifications')}>
                                <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{unreadCount}</span>
                                    </span>
                                )}
                            </button>
                            {isNotificationsOpen && <NotificationPanel notifications={notifications} onClose={() => setIsNotificationsOpen(false)} onMarkAsRead={onMarkNotificationsRead} />}
                        </div>
                        <button onClick={onLogout} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" title={t('mainLayout.logout')}>
                            <LogoutIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Low balance banner */}
            {user.balance < 10000 && (
                <div className="mx-4 -mt-2 mb-2">
                    <div className="rounded-lg p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-800 dark:text-yellow-200 flex items-center justify-between gap-2">
                        <p className="text-xs sm:text-sm">{t('configStep.insufficientFunds')}</p>
                        <button onClick={() => onNavigate('topUp')} className="text-xs px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600">{t('mainLayout.topUp')}</button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className={`flex-1 ${activePage === 'listProject' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                {renderActivePage()}
            </main>

            <footer className="w-full text-center p-4 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                 <span>
                    {t('auth.footer')[0]}
                    <a href="https://cdcgroup.uz" target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">CDCGroup</a>
                    {t('auth.footer')[1]}
                    <a href="https://cradev.uz" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-700 dark:text-gray-300 hover:underline">CraDev Company</a>
                    {t('auth.footer')[2]}
                </span>
            </footer>
        </div>
    );
};