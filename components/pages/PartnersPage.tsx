import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';

interface PartnerItem {
  id: number;
  name: string;
  short_info?: string;
  contact_person?: string;
  contact_phone?: string;
  website?: string;
  logo_url?: string;
}

export const PartnersPage: React.FC = () => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<PartnerItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.listPartners();
        setPartners(resp as PartnerItem[]);
      } catch (e) {
        console.error(e);
        setPartners([]);
      }
    })();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">{t('partners.title')}</h1>
        <p className="mt-1 text-gray-300 max-w-2xl mx-auto">{t('partners.subtitle')}</p>
      </div>

      {partners.length === 0 ? (
        <div className="text-center py-16 glass-panel">
          <p className="text-gray-300">{t('noProjects')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((p) => (
            <div key={p.id} className="group relative glass-panel overflow-hidden">
              <div className="aspect-video bg-black/10 flex items-center justify-center">
                {p.logo_url ? (
                  <img src={p.logo_url} alt={p.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-gray-300 text-lg font-semibold">{p.name}</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-100 truncate">{p.name}</h3>
              </div>
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-white font-bold mb-2">{p.name}</h4>
                  {p.short_info && <p className="text-gray-200 text-sm line-clamp-5">{p.short_info}</p>}
                </div>
                <div className="space-y-1 text-sm">
                  {p.contact_person && (
                    <div className="text-gray-200"><span className="font-semibold">{t('partners.contactPerson')}:</span> {p.contact_person}</div>
                  )}
                  {p.contact_phone && (
                    <div className="text-gray-200"><span className="font-semibold">{t('partners.contact')}:</span> <a className="text-cyan-400" href={`tel:${p.contact_phone}`}>{p.contact_phone}</a></div>
                  )}
                  {p.website && (
                    <div className="text-gray-200"><span className="font-semibold">{t('partners.website')}:</span> <a className="text-cyan-400" href={p.website} target="_blank" rel="noreferrer">{p.website}</a></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
