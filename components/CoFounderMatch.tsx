import React, { useState } from 'react';
import type { StartupIdea } from '../types';
import { getMarketTrendAlert } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

interface MarketTrendRadarProps {
  idea: StartupIdea;
}

const competitorUpdates = [
    { name: "Raqobatchi A", update: "Yangi 'Premium' tarif rejasini e'lon qildi." },
    { name: "Raqobatchi B", update: "Toshkentda yangi ofisini ochdi." },
    { name: "Raqobatchi C", update: "Marketing kampaniyasi uchun 20% chegirma taklif qilmoqda." },
];

export const MarketTrendRadar: React.FC<MarketTrendRadarProps> = ({ idea }) => {
    const [alert, setAlert] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { lang } = useLanguage();

    const ideaContext = JSON.stringify({
        projectName: idea.projectName,
        description: idea.description,
        industry: idea.marketingStrategy.targetAudience, // Assuming this contains industry info
        competitors: idea.swotAnalysis.threats.filter(t => t.toLowerCase().includes("raqobatchi")).slice(0, 2),
    }, null, 2);

    const handleGenerateAlert = async () => {
        setIsLoading(true);
        setAlert(null);
        try {
            // FIX: Pass the 'lang' argument to the function call.
            const response = await getMarketTrendAlert(ideaContext, lang);
            setAlert(response);
        } catch (error) {
            console.error("Bozor tahlilini olishda xatolik:", error);
            setAlert("**Xatolik!**\n\nTahlilni yuklab bo'lmadi. Iltimos, keyinroq urinib ko'ring.");
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg animate-fade-in">
      <h3 className="text-xl font-bold text-cyan-500 dark:text-cyan-400 mb-2">Bozor Radari</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Statik biznes-rejalarni unuting. Bozoringizni real vaqtda kuzating, raqobatchilardan bir qadam oldinda bo'ling va yangi imkoniyatlarni qo'ldan boy bermang.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
            {/* Opportunity Window */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Imkoniyatlar Oynasi</h4>
                <div className="min-h-[120px] p-4 bg-white dark:bg-gray-700 rounded-md flex items-center justify-center">
                    {isLoading ? (
                        <LoadingSpinner className="w-8 h-8" />
                    ) : alert ? (
                        <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: alert.replace(/\n/g, '<br/>') }} />
                    ) : (
                        <p className="text-sm text-center text-gray-500 dark:text-gray-400">Bozordagi so'nggi imkoniyat yoki xavfni aniqlash uchun AI tahlilini ishga tushuring.</p>
                    )}
                </div>
                 <button 
                    onClick={handleGenerateAlert}
                    disabled={isLoading}
                    className="w-full mt-3 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-400 transition-colors"
                >
                    {isLoading ? "Tahlil qilinmoqda..." : "Yangi Tahlil Yaratish"}
                 </button>
            </div>
            
            {/* Google Trends */}
            <div>
                 <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Google Trends Simulyatsiyasi</h4>
                 <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">"{idea.marketingStrategy.targetAudience}" so'rovining O'zbekistondagi mashhurligi</p>
                    {/* Placeholder for a graph */}
                    <svg viewBox="0 0 100 30" className="w-full h-auto">
                        <polyline fill="none" stroke="#38bdf8" strokeWidth="1" points="0,25 20,20 40,22 60,15 80,18 100,10" />
                    </svg>
                 </div>
            </div>

        </div>

        {/* Right Column */}
        <div>
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Raqobatchilar Monitoringi</h4>
            <div className="space-y-3">
                {competitorUpdates.map((item, index) => (
                     <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="w-3 h-3 mt-1 rounded-full bg-red-500 flex-shrink-0"></div>
                        <div>
                            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{item.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.update}</p>
                        </div>
                     </div>
                ))}
            </div>
            <p className="text-xs text-center text-gray-400 dark:text-gray-400 mt-4">(Bu simulyatsiya qilingan ma'lumotlar)</p>
        </div>
      </div>
    </div>
  );
};