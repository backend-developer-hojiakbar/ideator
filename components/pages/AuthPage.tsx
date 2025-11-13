
import React, { useState } from 'react';
import { User } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';
import { useLanguage } from '../../contexts/LanguageContext';
import { api, setTokens } from '../../services/api';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('+998901234567');
  const [password, setPassword] = useState('12345678');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        if (isLogin) {
          const resp = await api.login(phone, password);
          setTokens(resp.access, resp.refresh);
          const mappedUser: User = {
            email: resp.user.phone_number,
            isSubscribed: !!resp.user.is_subscribed,
            balance: typeof resp.user.balance === 'string' ? parseFloat(resp.user.balance) : resp.user.balance,
          };
          onLogin(mappedUser);
        } else {
          await api.register(phone, password);
          const resp = await api.login(phone, password);
          setTokens(resp.access, resp.refresh);
          const mappedUser: User = {
            email: resp.user.phone_number,
            isSubscribed: !!resp.user.is_subscribed,
            balance: typeof resp.user.balance === 'string' ? parseFloat(resp.user.balance) : resp.user.balance,
          };
          onLogin(mappedUser);
        }
      } catch (err) {
        alert('Auth error');
        console.error(err);
      }
    })();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        <main className="w-full max-w-md">
            <div className="text-center mb-8">
                <SparklesIcon className="w-16 h-16 text-cyan-500 dark:text-cyan-400 mx-auto" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">{t('auth.title')}</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{t('auth.subtitle')}</p>
            </div>
        
            <div className="glass-panel p-8">
                <div className="mb-6 border-b border-gray-400/30">
                    <nav className="-mb-px flex space-x-6">
                        <button onClick={() => setIsLogin(true)} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${isLogin ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
                            {t('auth.loginTab')}
                        </button>
                        <button onClick={() => setIsLogin(false)} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${!isLogin ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
                            {t('auth.registerTab')}
                        </button>
                    </nav>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.emailLabel')}</label>
                        <div className="mt-1">
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-3 text-sm ios-input"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.passwordLabel')}</label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 text-sm ios-input"
                            />
                        </div>
                    </div>
                     <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 liquid-button"
                        >
                            {isLogin ? t('auth.loginButton') : t('auth.registerButton')}
                        </button>
                    </div>
                </form>
            </div>
        </main>
        <footer className="w-full text-center p-4 mt-8 text-xs text-gray-500 dark:text-gray-400 absolute bottom-0">
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
