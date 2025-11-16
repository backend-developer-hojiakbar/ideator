import React, { useState } from 'react';
import type { IdeaConfiguration } from '../../types';
import { TicketIcon } from '../icons/TicketIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { useLanguage } from '../../contexts/LanguageContext';

interface ConfigStepProps {
  onGenerate: (config: IdeaConfiguration) => void;
  error: string | null;
  onBack: () => void;
}

const SelectGroup: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full p-3 text-sm focus:border-cyan-500 block ios-input"
        >
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);

const CheckboxGroup: React.FC<{ label: string, options: string[], selectedOptions: string[], onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, options, selectedOptions, onChange }) => (
    <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="grid grid-cols-2 gap-3">
            {options.map(option => (
                <label key={option} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${selectedOptions.includes(option) ? 'bg-cyan-500/20 border-cyan-500' : 'ios-input border-transparent hover:border-cyan-400/50'}`}>
                    <input
                        type="checkbox"
                        value={option}
                        checked={selectedOptions.includes(option)}
                        onChange={onChange}
                        className="w-5 h-5 text-cyan-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-200">{option}</span>
                </label>
            ))}
        </div>
    </div>
);


const InputGroup: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, optional?: boolean, error?: string }> = ({ label, value, onChange, placeholder, optional = false, error }) => {
    const { t } = useLanguage();
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {optional && <span className="text-xs text-gray-500 dark:text-gray-400">{t('optional')}</span>}
            </label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full p-3 text-sm ios-input ${error ? 'border border-red-500 focus:border-red-500' : ''}`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};

const TextareaGroup: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder: string, optional?: boolean, error?: string }> = ({ label, value, onChange, placeholder, optional = false, error }) => {
    const { t } = useLanguage();
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {optional && <span className="text-xs text-gray-500 dark:text-gray-400">{t('optional')}</span>}
            </label>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={3}
                className={`w-full p-3 text-sm ios-input ${error ? 'border border-red-500 focus:border-red-500' : ''}`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};


export const ConfigStep: React.FC<ConfigStepProps> = ({ onGenerate, error, onBack }) => {
  const { t } = useLanguage();
  const complexityLevels = t('configStep.complexityLevels');
  const businessModels = t('configStep.businessModels');

  const [config, setConfig] = useState<IdeaConfiguration>({
    industry: '',
    investment: '',
    ideaTopic: '',
    briefInfo: '',
    complexity: complexityLevels[0],
    businessModel: [],
    isGoldenTicket: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Omit<IdeaConfiguration, 'isGoldenTicket' | 'businessModel'>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setConfig(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleBusinessModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setConfig(prev => {
        const currentModels = prev.businessModel;
        if (checked) {
            return { ...prev, businessModel: [...currentModels, value] };
        } else {
            return { ...prev, businessModel: currentModels.filter(model => model !== value) };
        }
    });
  };

  const handleToggleGoldenTicket = () => {
    setConfig(prev => ({ ...prev, isGoldenTicket: !prev.isGoldenTicket }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!config.industry.trim()) newErrors.industry = 'Bu maydon majburiy.';
    if (!config.investment.trim()) newErrors.investment = 'Bu maydon majburiy.';
    if (!config.complexity) newErrors.complexity = 'Bu maydon majburiy.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onGenerate(config);
  };

  return (
    <div className="h-full">
        <div className="flex flex-col h-full animate-fade-in">
        <div className="relative flex items-center justify-center mb-2">
            <button
                onClick={onBack}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
                aria-label={t('back')}
            >
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-gray-100">{t('configStep.title')}</h2>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{t('configStep.subtitle')}</p>
        
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 flex-grow overflow-y-auto pr-2">
            <InputGroup 
                label={t('configStep.industryLabel')} 
                value={config.industry} 
                onChange={handleChange('industry')} 
                placeholder={t('configStep.industryPlaceholder')} 
                error={errors.industry}
            />
            <InputGroup 
                label={t('configStep.topicLabel')} 
                value={config.ideaTopic || ''} 
                onChange={handleChange('ideaTopic')} 
                placeholder={t('configStep.topicPlaceholder')} 
                optional={true}
            />
            <TextareaGroup 
                label={t('configStep.infoLabel')} 
                value={config.briefInfo || ''} 
                onChange={handleChange('briefInfo')} 
                placeholder={t('configStep.infoPlaceholder')} 
                optional={true}
            />
            <InputGroup 
                label={t('configStep.investmentLabel')} 
                value={config.investment} 
                onChange={handleChange('investment')} 
                placeholder={t('configStep.investmentPlaceholder')}
                error={errors.investment}
            />
            <div>
                <SelectGroup label={t('configStep.complexityLabel')} value={config.complexity} onChange={handleChange('complexity')} options={complexityLevels} />
                {errors.complexity && <p className="mt-1 text-xs text-red-600">{errors.complexity}</p>}
            </div>
            <CheckboxGroup 
              label={t('configStep.businessModelLabel')} 
              options={businessModels} 
              selectedOptions={config.businessModel} 
              onChange={handleBusinessModelChange} 
            />
            
            <div className="!mt-6">
                <label htmlFor="golden-ticket-toggle" className="flex items-center cursor-pointer p-4 rounded-lg bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-500/30">
                    <div className="flex-shrink-0">
                        <TicketIcon className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="ms-4 flex-grow">
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{t('configStep.goldenTicketLabel')}</span>
                        <p className="text-xs text-amber-700/80 dark:text-amber-300/80">{t('configStep.goldenTicketDesc')}</p>
                    </div>
                    <div className="relative">
                        <input type="checkbox" id="golden-ticket-toggle" className="sr-only" checked={config.isGoldenTicket} onChange={handleToggleGoldenTicket} />
                        <div className="w-[52px] h-8 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors ios-toggle-bg"></div>
                    </div>
                </label>
            </div>
        </form>

        <div className="mt-6 flex-shrink-0">
            <button
            type="submit"
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 px-8 py-3 liquid-button"
            >
            <SparklesIcon className="w-5 h-5"/>
            {t('configStep.generateButton')}
            </button>
        </div>
        </div>
    </div>
  );
};