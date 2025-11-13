import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../icons/LoadingSpinner';
import { CheckIcon } from '../icons/CheckIcon';
import { useLanguage } from '../../contexts/LanguageContext';

export const GeneratingStep: React.FC = () => {
    const [completedSteps, setCompletedSteps] = useState(0);
    const { t } = useLanguage();
    const generationSteps: string[] = t('generatingStep.steps');


    useEffect(() => {
        const interval = setInterval(() => {
            setCompletedSteps(prev => {
                if (prev < generationSteps.length) {
                    return prev + 1;
                }
                clearInterval(interval);
                // Oxirgi qadamning spinnerini aylantirishda davom etish
                return generationSteps.length;
            });
        }, 1500); 
        return () => clearInterval(interval);
    }, [generationSteps.length]);

    return (
        <div className="h-full">
            <div className="flex flex-col items-center justify-center text-center h-full animate-fade-in">
                <LoadingSpinner className="w-16 h-16 text-cyan-500 dark:text-cyan-400 mb-6" />
                <h2 className="text-2xl font-bold text-cyan-500 dark:text-cyan-400 mb-6">{t('generatingStep.title')}</h2>
                
                <div className="text-left w-full max-w-sm">
                    <ul className="space-y-3">
                        {generationSteps.map((step, index) => (
                            <li key={index} className="flex items-center gap-3">
                                {index < completedSteps ? (
                                    <CheckIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                                ) : index === completedSteps ? (
                                    <LoadingSpinner className="w-6 h-6 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                                ) : (
                                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                    </div>
                                )}
                                <span className={`transition-colors duration-500 ${index < completedSteps ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {step}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};