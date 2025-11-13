import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageIcon } from './icons/LanguageIcon';
import type { Language } from '../types';

const languages: { code: Language; name: string }[] = [
    { code: 'uz-Latn', name: "O'zbekcha (Lotin)" },
    { code: 'uz-Cyrl', name: "Ўзбекча (Кирилл)" },
    { code: 'ru', name: "Русский" },
    { code: 'en', name: "English" },
];

export const LanguageSwitcher: React.FC = () => {
    const { lang, setLang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLanguageChange = (languageCode: Language) => {
        setLang(languageCode);
        setIsOpen(false);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                title="Tilni o'zgartirish"
            >
                <LanguageIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                className={`w-full text-left px-4 py-2 text-sm ${
                                    lang === language.code
                                        ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {language.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
