import React, { useState, useEffect } from 'react';
import './styles/typography.css';
import './styles/responsive.css';
import './styles/overrides.css';
import { AuthPage } from './components/pages/AuthPage';
import { MainLayout } from './components/layout/MainLayout';
import { PartnersPage } from './components/pages/PartnersPage';
import { AnnouncementsPage } from './components/pages/AnnouncementsPage';
import { ConfigStep } from './components/steps/ConfigStep';
import { GeneratingStep } from './components/steps/GeneratingStep';
import { ProjectWorkspacePage } from './components/pages/ProjectWorkspacePage';
import { TopUpPage } from './components/pages/TopUpPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { generateStartupIdea } from './services/geminiService';
import type { IdeaConfiguration, StartupIdea, User, Notification } from './types';
import { AtmScreen } from './components/AtmScreen';
import { api, clearTokens, getAccessToken } from './services/api';

export type Page = 
  | 'auth' 
  | 'dashboard' 
  | 'newProjectConfig' 
  | 'newProjectGenerating' 
  | 'projectWorkspace'
  | 'topUp'
  | 'investorMarketplace'
  | 'listProject'
  | 'partners'
  | 'announcements'
  | 'account';
  
const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('auth');
  const [bootstrapping, setBootstrapping] = useState(true);
  const [projects, setProjects] = useState<StartupIdea[]>([]);
  const [activeProject, setActiveProject] = useState<StartupIdea | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const bootstrap = async () => {
      const token = getAccessToken();
      if (!token) {
        setBootstrapping(false);
        return;
      }
      try {
        const me = await api.me();
        const mappedUser: User = {
          email: me.phone_number,
          isSubscribed: !!me.is_subscribed,
          balance: typeof me.balance === 'string' ? parseFloat(me.balance) : me.balance,
          isInvestor: !!me.is_investor,
        };
        setUser(mappedUser);
        const proj = await api.getProjects();
        const mappedProjects: StartupIdea[] = (proj as any[]).map(p => ({ ...p.data, id: String(p.id) }));
        setProjects(mappedProjects);
        const notifs = await api.getNotifications();
        const mappedNotifs: Notification[] = (notifs as any[]).map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          timestamp: new Date(n.timestamp).getTime(),
          read: n.read,
        }));
        setNotifications(mappedNotifs);
        setPage('dashboard');
      } catch (e) {
        console.error(e);
      } finally {
        setBootstrapping(false);
      }
    };
    bootstrap();
  }, []);

  const addNotification = (_userEmail: string, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
          ...notification,
          id: Date.now(),
          timestamp: Date.now(),
          read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationsAsRead = async () => {
      if (!user) return;
      await api.markNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogin = async (_loggedInUser: User) => {
    try {
      const me = await api.me();
      const mappedUser: User = {
        email: me.phone_number,
        isSubscribed: !!me.is_subscribed,
        balance: typeof me.balance === 'string' ? parseFloat(me.balance) : me.balance,
        isInvestor: !!me.is_investor,
      };
      setUser(mappedUser);
      const proj = await api.getProjects();
      const mappedProjects: StartupIdea[] = (proj as any[]).map(p => ({ ...p.data, id: String(p.id) }));
      setProjects(mappedProjects);
      const notifs = await api.getNotifications();
      const mappedNotifs: Notification[] = (notifs as any[]).map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        timestamp: new Date(n.timestamp).getTime(),
        read: n.read,
      }));
      setNotifications(mappedNotifs);
      setPage('dashboard');
    } catch (e) {
      console.error(e);
      alert('Session init failed');
    }
  };
  
  const handleLogout = () => {
    clearTokens();
    setUser(null);
    setProjects([]);
    setActiveProject(null);
    setNotifications([]);
    setPage('auth');
  };

  const handleNavigate = (targetPage: Page, project?: StartupIdea) => {
    if (project) {
        setActiveProject(project);
    }
    setPage(targetPage);
  };
  
  const handleStartNewProject = () => {
      if (user && user.balance < 10000) {
          alert(t('configStep.insufficientFunds'));
          setPage('topUp');
          return;
      }
      setPage('newProjectConfig');
  };

  const handleGenerate = async (config: IdeaConfiguration) => {
    setPage('newProjectGenerating');
    setError(null);
    try {
      const generatedIdea = await generateStartupIdea(config, lang);
      const backendProject = await api.startProject({
        project_name: generatedIdea.projectName,
        description: generatedIdea.description,
        config: null,
        data: generatedIdea,
      });
      const newProject: StartupIdea = { ...generatedIdea, id: String(backendProject.id) };
      setProjects(prev => [...prev, newProject]);
      setActiveProject(newProject);
      // Refresh user balance
      const me = await api.me();
      setUser({
        email: me.phone_number,
        isSubscribed: !!me.is_subscribed,
        balance: typeof me.balance === 'string' ? parseFloat(me.balance) : me.balance,
      });
      setPage('projectWorkspace');
    } catch (e) {
      console.error(e);
      setError(t('configStep.generationError'));
      setPage('newProjectConfig');
    }
  };

  const handleTopUpRequest = async (amount: number, promo_code?: string) => {
      if (!user) return;
      try {
        await api.topup(amount, promo_code);
        const me = await api.me();
        setUser({
          email: me.phone_number,
          isSubscribed: !!me.is_subscribed,
          balance: typeof me.balance === 'string' ? parseFloat(me.balance) : me.balance,
        });
        const notifs = await api.getNotifications();
        const mappedNotifs: Notification[] = (notifs as any[]).map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          timestamp: new Date(n.timestamp).getTime(),
          read: n.read,
        }));
        setNotifications(mappedNotifs);
        setPage('dashboard');
      } catch (e) {
        console.error(e);
        alert('Top up failed');
      }
  };

  const handleUpdateProject = (updatedProject: StartupIdea) => {
    const updatedProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(updatedProjects);
    setActiveProject(updatedProject);
    if (user) {
      localStorage.setItem(`projects_${user.email}`, JSON.stringify(updatedProjects));
    }
    alert(t('workspace.projectUpdated'));
  };

  const renderContent = () => {
    if (bootstrapping) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-panel p-6">Loading...</div>
        </div>
      );
    }
    if (!user) {
      // Allow viewing Partners without login
      if (page === 'partners') {
        return <PartnersPage />;
      }
      // Allow viewing Announcements without login
      if (page === 'announcements') {
        return <AnnouncementsPage />;
      }
      return <AuthPage onLogin={handleLogin} />;
    }
    
    switch (page) {
        case 'dashboard':
        case 'investorMarketplace':
        case 'listProject':
        case 'partners':
        case 'announcements':
        case 'account':
            return <MainLayout 
                        user={user} 
                        onLogout={handleLogout} 
                        onNavigate={handleNavigate} 
                        projects={projects} 
                        activePage={page}
                        notifications={notifications}
                        onMarkNotificationsRead={markNotificationsAsRead}
                   />;
        case 'topUp':
            return <TopUpPage user={user} onTopUpRequest={handleTopUpRequest} onBack={() => setPage('dashboard')} />;
        case 'newProjectConfig':
            return <div className="min-h-screen flex items-center justify-center p-4"><AtmScreen><ConfigStep onGenerate={handleGenerate} error={error} onBack={() => setPage('dashboard')} /></AtmScreen></div>;
        case 'newProjectGenerating':
            return <div className="min-h-screen flex items-center justify-center p-4"><AtmScreen><GeneratingStep /></AtmScreen></div>;
        case 'projectWorkspace':
            return activeProject ? <ProjectWorkspacePage idea={activeProject} onBack={() => handleNavigate('dashboard')} onUpdateProject={handleUpdateProject} /> : <p>Loyiha topilmadi.</p>;
        default:
            return <AuthPage onLogin={handleLogin} />;
    }
  };
  
  return (
      <div className="min-h-screen font-sans transition-colors duration-500">
        {renderContent()}
      </div>
  );
}


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;