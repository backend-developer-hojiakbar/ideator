import React, { useState } from 'react';
import type { StartupIdea } from '../types';
import { generateCharter, generateProtocol, generateOrder } from '../services/docGenerator';
import { DownloadIcon } from './icons/DownloadIcon';

interface LegalPackGeneratorProps {
  idea: StartupIdea;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id} className="block mb-2 text-sm font-medium text-cyan-600 dark:text-cyan-200">{label}</label>
        <input
            {...props}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
        />
    </div>
);

export const LegalPackGenerator: React.FC<LegalPackGeneratorProps> = ({ idea }) => {
    const [formData, setFormData] = useState({
        companyName: `${idea.projectName} MChJ`,
        founderName: '',
        passportSerial: '',
        passportNumber: '',
        address: '',
        directorName: '',
    });
    const [isGenerating, setIsGenerating] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleDownload = async (docType: 'charter' | 'protocol' | 'order') => {
        setIsGenerating(docType);
        try {
            const docData = { ...formData, projectName: idea.projectName };
            let blob: Blob | null = null;
            let fileName = '';

            switch (docType) {
                case 'charter':
                    blob = await generateCharter(docData);
                    fileName = `${docData.companyName}_Ustav.docx`;
                    break;
                case 'protocol':
                    blob = await generateProtocol(docData);
                    fileName = `Tasischi_yigilishi_bayonnomasi.docx`;
                    break;
                case 'order':
                    blob = await generateOrder(docData);
                    fileName = `Direktorni_tayinlash_buyrugi.docx`;
                    break;
            }

            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error(`Hujjat yaratishda xatolik: ${docType}`, error);
            alert("Hujjatni yaratishda xatolik yuz berdi. Iltimos, ma'lumotlarni to'g'ri kiritganingizni tekshiring.");
        } finally {
            setIsGenerating(null);
        }
    };
    
    const isFormValid = formData.companyName && formData.founderName && formData.passportSerial && formData.passportNumber && formData.address && formData.directorName;

    return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg animate-fade-in max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-cyan-500 dark:text-cyan-400 mb-2">Yuridik Hujjatlar Generator</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Biznesingizni rasmiylashtirishdagi birinchi qadam. Quyidagi maydonlarni to'ldiring va MChJ ochish uchun zarur hujjatlar andozalarini bir zumda oling.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 border-b pb-2">Ma'lumotlarni kiriting</h4>
                    <InputField label="Kompaniya Nomi (MChJ)" id="companyName" value={formData.companyName} onChange={handleInputChange} />
                    <InputField label="Ta'sischi F.I.O." id="founderName" placeholder="To'liq ism-sharifingiz" value={formData.founderName} onChange={handleInputChange} />
                    <div className="flex gap-4">
                        <InputField label="Pasport Seriyasi" id="passportSerial" placeholder="AA" value={formData.passportSerial} onChange={handleInputChange} />
                        <InputField label="Pasport Raqami" id="passportNumber" placeholder="1234567" value={formData.passportNumber} onChange={handleInputChange} />
                    </div>
                    <InputField label="Yashash Manzili" id="address" placeholder="Pasport bo'yicha" value={formData.address} onChange={handleInputChange} />
                    <InputField label="Direktor F.I.O." id="directorName" placeholder="O'zingiz yoki boshqa shaxs" value={formData.directorName} onChange={handleInputChange} />
                </div>
                <div className="space-y-4">
                     <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 border-b pb-2">Hujjatlarni Yuklab Olish</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400">Barcha ma'lumotlarni kiritganingizdan so'ng, hujjatlarni yuklab olishingiz mumkin.</p>
                     
                     <button onClick={() => handleDownload('charter')} disabled={!isFormValid || !!isGenerating} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors">
                        <DownloadIcon className="w-5 h-5"/>
                        {isGenerating === 'charter' ? 'Yaratilmoqda...' : 'MChJ Ustavi (.docx)'}
                     </button>
                      <button onClick={() => handleDownload('protocol')} disabled={!isFormValid || !!isGenerating} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors">
                        <DownloadIcon className="w-5 h-5"/>
                        {isGenerating === 'protocol' ? 'Yaratilmoqda...' : 'Ta\'sischilar Yig\'ilishi Bayonnomasi (.docx)'}
                     </button>
                      <button onClick={() => handleDownload('order')} disabled={!isFormValid || !!isGenerating} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors">
                        <DownloadIcon className="w-5 h-5"/>
                        {isGenerating === 'order' ? 'Yaratilmoqda...' : 'Direktorni Tayinlash Buyrug\'i (.docx)'}
                     </button>

                    <div className="!mt-8 p-4 border-dashed border-2 border-green-500/50 rounded-lg bg-green-500/10 text-center">
                        <h5 className="font-bold text-green-700 dark:text-green-300">BONUS</h5>
                        <p className="text-sm text-green-600/90 dark:text-green-400/90 mt-1">
                            Hamkorimiz "Legal Solutions" firmasi bilan bir martalik bepul yuridik maslahat uchun vaucher. Parol: <span className="font-mono bg-green-200 dark:bg-green-800 px-1 rounded">GOYA2024</span>
                        </p>
                    </div>

                </div>
            </div>
            <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
                **Izoh:** Bu hujjatlar andoza hisoblanadi. Rasmiylashtirishdan oldin yurist bilan maslahatlashish tavsiya etiladi.
            </p>
        </div>
    );
};