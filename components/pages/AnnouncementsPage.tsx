import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Announcement } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await api.listAnnouncements();
        setAnnouncements(resp as Announcement[]);
      } catch (e) {
        console.error(e);
        setError(t('announcements.errorLoading'));
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 animate-fade-in">
      <div className="glass-panel p-4 sm:p-6 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t('announcements.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300">{t('announcements.subtitle')}</p>
      </div>

      {loading && <div className="glass-panel p-6 text-center">{t('loading')}</div>}
      {error && <div className="glass-panel p-6 text-center text-red-600">{error}</div>}

      {!loading && !error && announcements.length === 0 && (
        <div className="glass-panel p-6 text-center text-gray-700 dark:text-gray-300">
          <h3 className="text-lg font-semibold mb-1">{t('announcements.emptyTitle')}</h3>
          <p className="text-sm">{t('announcements.emptySubtitle')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map(a => (
          <div key={a.id} className="glass-panel overflow-hidden">
            {a.image_url && (
              <div className="h-40 w-full overflow-hidden bg-black/5 dark:bg-white/5">
                <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{a.title}</h3>
              {a.deadline && (
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  {t('announcements.deadline')}: {new Date(a.deadline).toLocaleString()}
                </p>
              )}
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">{a.body}</p>
              {a.tags && a.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {a.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {a.rules_url && (
                  <a href={a.rules_url} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700">{t('announcements.viewRules')}</a>
                )}
                {a.submission_link && (
                  <a href={a.submission_link} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1 rounded-full bg-green-600 text-white hover:bg-green-700">{t('announcements.applyNow')}</a>
                )}
              </div>
              <p className="text-[10px] text-gray-500 mt-2">{t('announcements.publishedAt', new Date(a.created_at).toLocaleString())}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
