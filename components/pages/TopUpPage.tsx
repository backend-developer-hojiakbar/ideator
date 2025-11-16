import React, { useState, useMemo } from 'react';
import type { User } from '../../types';
import { WalletIcon } from '../icons/WalletIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ClipboardIcon } from '../icons/ClipboardIcon';
import { UploadIcon } from '../icons/UploadIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { useLanguage } from '../../contexts/LanguageContext';

interface TopUpPageProps {
    user: User;
    onTopUpRequest: (amount: number, promo_code?: string) => void;
    onBack: () => void;
}

const TOP_UP_AMOUNTS = [20000, 50000, 100000, 200000];
const CARD_NUMBER = '5614 6817 1492 1651';

type TopUpStep = 'select_amount' | 'payment_details' | 'pending_confirmation';

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1">
            <ClipboardIcon className="w-4 h-4" />
            {copied ? t('topUp.copied') : t('topUp.instructionCopy')}
        </button>
    );
};

export const TopUpPage: React.FC<TopUpPageProps> = ({ user, onTopUpRequest, onBack }) => {
    const [step, setStep] = useState<TopUpStep>('select_amount');
    const [baseAmount, setBaseAmount] = useState<number>(TOP_UP_AMOUNTS[0]);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [promoCode, setPromoCode] = useState<string>('');
    const { t } = useLanguage();

    const uniqueAmount = useMemo(() => {
        // Generate a random 2-digit number (10-99) to append for uniqueness
        return baseAmount + (Math.floor(Math.random() * 90) + 10);
    }, [baseAmount]);
    
    const handleProceedToPayment = (amount: number) => {
        setBaseAmount(amount);
        setStep('payment_details');
    };

    const handleConfirmPayment = () => {
        onTopUpRequest(baseAmount, promoCode.trim() || undefined);
        setStep('pending_confirmation');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('uz-Latn').format(amount);
    }

    const renderContent = () => {
        switch (step) {
            case 'select_amount':
                return (
                    <>
                        <div className="text-center">
                            <WalletIcon className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto" />
                            <h1 className="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-100">{t('topUp.title')}</h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">
                                {t('topUp.currentBalance', user.balance.toLocaleString())}
                            </p>
                        </div>

                        <div className="mt-8">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">{t('topUp.selectAmount')}</p>
                            <div className="grid grid-cols-2 gap-4">
                                {TOP_UP_AMOUNTS.map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => handleProceedToPayment(amount)}
                                        className="p-4 rounded-lg border-2 text-center transition-colors border-gray-300 dark:border-gray-600 hover:border-cyan-400"
                                    >
                                        <span className="font-bold text-lg text-gray-800 dark:text-gray-100">{amount.toLocaleString()}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400"> so'm</span>
                                    </button>
                                ))}
                            </div>

                            {/* Admin Contact Numbers */}
                            <div className="p-4 rounded-lg bg-black/10 dark:bg-white/10">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Admin bilan bog'lanish (24/7):</p>
                                <ul className="text-sm space-y-1">
                                    <li>
                                        <a href="tel:+998947430912" className="text-cyan-600 dark:text-cyan-400 font-medium">+998 94 743 09 12</a>
                                    </li>
                                    <li>
                                        <a href="tel:+998910574905" className="text-cyan-600 dark:text-cyan-400 font-medium">+998 91 057 49 05</a>
                                    </li>
                                    <li>
                                        <a href="tel:+998937778857" className="text-cyan-600 dark:text-cyan-400 font-medium">+998 93 777 88 57</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                );
            case 'payment_details':
                return (
                    <>
                        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">{t('topUp.paymentDetailsTitle')}</h1>
                        <div className="mt-6 space-y-4">
                            {/* Card Info */}
                            <div className="p-4 rounded-lg bg-black/10 dark:bg-white/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('topUp.instructionCardNumber')}</span>
                                    <CopyButton textToCopy={CARD_NUMBER.replace(/\s/g, '')} />
                                </div>
                                <p className="font-mono text-xl tracking-widest text-gray-800 dark:text-gray-200 mt-1">{CARD_NUMBER}</p>
                            </div>
                            {/* Amount Info */}
                            <div className="p-4 rounded-lg bg-black/10 dark:bg-white/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('topUp.instructionAmount')}</span>
                                    <CopyButton textToCopy={String(uniqueAmount)} />
                                </div>
                                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">{formatCurrency(uniqueAmount)} UZS</p>
                            </div>

                            {/* Promo Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('topUp.promoCodeLabel')}</label>
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder={t('topUp.promoCodePlaceholder')}
                                    className="w-full px-3 py-2 rounded-lg border bg-white/70 dark:bg-gray-800/60 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                />
                            </div>
                             {/* Warnings */}
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs space-y-2">
                                <p className="font-bold text-sm">{t('topUp.warningTitle')}</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>{t('topUp.warning1')}</li>
                                    <li>{t('topUp.warning2')}</li>
                                    <li>{t('topUp.warning3')}</li>
                                    <li>{t('topUp.warning4')}</li>
                                </ul>
                                <div className="pt-2">
                                  <p className="font-semibold">{t('topUp.warningExampleWrong', formatCurrency(baseAmount))}</p>
                                  <p className="font-semibold">{t('topUp.warningExampleCorrect', formatCurrency(uniqueAmount))}</p>
                                </div>
                            </div>

                             {/* Receipt Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('topUp.uploadReceipt')}</label>
                                <label htmlFor="receipt-upload" className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-500">
                                    <UploadIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {receiptFile ? receiptFile.name : t('topUp.uploadButton')}
                                    </span>
                                </label>
                                <input id="receipt-upload" type="file" className="sr-only" onChange={(e) => setReceiptFile(e.target.files ? e.target.files[0] : null)} accept="image/*,.pdf"/>
                            </div>

                            <button
                                onClick={handleConfirmPayment}
                                disabled={!receiptFile}
                                className="w-full flex justify-center py-3 px-4 liquid-button disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                               {t('topUp.confirmPayment')}
                            </button>
                        </div>
                    </>
                )
            case 'pending_confirmation':
                return (
                    <div className="text-center py-8">
                        <CheckIcon className="w-20 h-20 text-green-500 dark:text-green-400 mx-auto" />
                        <h1 className="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-100">{t('topUp.pendingConfirmationTitle')}</h1>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">{t('topUp.pendingConfirmationMessage')}</p>
                        <button onClick={onBack} className="mt-8 px-6 py-2 liquid-button">
                            {t('topUp.goBackToDashboard')}
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900/50">
            <div className="w-full max-w-md glass-panel p-6 sm:p-8 relative">
                {step !== 'pending_confirmation' && (
                    <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 text-sm">
                        <ArrowLeftIcon className="w-4 h-4"/>
                        {t('back')}
                    </button>
                )}
                {renderContent()}
            </div>
        </div>
    );
};