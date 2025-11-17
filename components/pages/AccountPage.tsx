import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

type MeResponse = {
  phone_number: string;
  balance: string | number;
  is_subscribed: boolean;
  is_investor?: boolean;
  referral_code?: string | null;
  referrals_count?: number;
};

export const AccountPage: React.FC = () => {
  const { t } = useLanguage();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api.me();
        setMe(data as MeResponse);
      } catch (e) {
        setError('Account ma\'lumotlarini yuklashda xatolik.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    try {
      await api.changePassword(oldPassword, newPassword);
      setPwMsg('Parol yangilandi.');
      setOldPassword('');
      setNewPassword('');
    } catch (e) {
      setPwMsg('Parolni yangilashda xatolik.');
    }
  };

  const handleGenerateReferral = async () => {
    if (!me) return;
    try {
      const resp = await api.generateReferral();
      const code = (resp as any)?.referral_code as string;
      setMe({ ...me, referral_code: code });
    } catch (e) {
      /* no-op */
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-2 sm:p-4 animate-fade-in">
      <div className="glass-panel p-4 sm:p-6 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t('mainLayout.navAccount')}</h2>
        <p className="text-gray-600 dark:text-gray-300">Hisob ma'lumotlari va xavfsizlik sozlamalari</p>
      </div>

      {loading && <div className="glass-panel p-6 text-center">{t('loading')}</div>}
      {error && <div className="glass-panel p-6 text-center text-red-600">{error}</div>}

      {!loading && !error && me && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-panel p-4 sm:p-6 space-y-3">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Profil</h3>
            <div className="text-sm">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-gray-600 dark:text-gray-300">Telefon</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">{me.phone_number}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-gray-600 dark:text-gray-300">Balans</span>
                <span className="font-semibold text-green-700 dark:text-green-300">{(typeof me.balance === 'string' ? parseFloat(me.balance) : me.balance).toLocaleString()} so'm</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-gray-600 dark:text-gray-300">Investor</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">{me.is_investor ? 'Ha' : 'Yo\'q'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-gray-600 dark:text-gray-300">Referral kod</span>
                <span
                  className="font-semibold text-gray-800 dark:text-gray-100 underline cursor-pointer select-all"
                  onClick={() => {
                    if (me.referral_code) {
                      navigator.clipboard.writeText(`${window.location.origin}?ref=${me.referral_code}`);
                    }
                  }}
                  title={me.referral_code ? 'Nusxa olish uchun bosing' : ''}
                >
                  {me.referral_code ? `${window.location.origin}?ref=${me.referral_code}` : '-'}
                </span>
              </div>
              {!me.referral_code && (
                <div className="flex items-center justify-between py-2 gap-2">
                  <button onClick={handleGenerateReferral} className="text-xs px-3 py-1 rounded-md bg-cyan-600 text-white hover:bg-cyan-700">Referral kod yaratish</button>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 dark:text-gray-300">Taklif qilingan do\'stlar</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">{me.referrals_count ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 sm:p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Parolni almashtirish</h3>
            <form onSubmit={onChangePassword} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Eski parol</label>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-3 text-sm ios-input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Yangi parol</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 text-sm ios-input" required />
              </div>
              {pwMsg && (
                <div className={`text-sm ${pwMsg.includes('xatolik') ? 'text-red-600' : 'text-green-600'}`}>{pwMsg}</div>
              )}
              <button type="submit" className="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 text-sm">Saqlash</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
