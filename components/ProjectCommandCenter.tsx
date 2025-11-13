import React, { useState, useEffect, useMemo } from 'react';
import type { StartupIdea, KanbanData, KanbanTask, KanbanColumn } from '../types';
import { getAiCoPilotResponse } from '../services/geminiService';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

interface AIHelperModalProps {
    task: KanbanTask;
    onClose: () => void;
}

const AIHelperModal: React.FC<AIHelperModalProps> = ({ task, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [query, setQuery] = useState('Bu vazifani kichikroq qadamlarga bo\'lib ber.');
    const { lang } = useLanguage();

    const handleGenerate = async () => {
        setIsLoading(true);
        setResponse('');
        try {
            // FIX: Pass the 'lang' argument to the function call.
            const result = await getAiCoPilotResponse(task.content, query, lang);
            setResponse(result);
        } catch (error) {
            console.error(error);
            setResponse('Kechirasiz, AI yordamchisi bilan bog\'lanishda xatolik yuz berdi.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleGenerate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">AI Co-Pilot Yordamchisi</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Vazifa: {task.content}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
                </header>
                <div className="flex-1 overflow-y-auto p-4 prose dark:prose-invert prose-sm max-w-none">
                    {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner className="w-8 h-8" /></div>}
                    {response && <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }} />}
                </div>
                 <footer className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
                    <div className="flex gap-2">
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Yordam uchun so'rov..."
                          disabled={isLoading}
                          className="w-full p-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg border dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
                        />
                        <button onClick={handleGenerate} disabled={isLoading || !query.trim()} className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-400 disabled:cursor-not-allowed transition-colors">
                            {isLoading ? '...': 'Yaratish'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};


interface ProjectCommandCenterProps {
    idea: StartupIdea;
}

export const ProjectCommandCenter: React.FC<ProjectCommandCenterProps> = ({ idea }) => {
    const [boardData, setBoardData] = useState<KanbanData | null>(null);
    const [activeTaskForAI, setActiveTaskForAI] = useState<KanbanTask | null>(null);

    useEffect(() => {
        const initialTasks: Record<string, KanbanTask> = {};
        idea.actionableChecklist.items.forEach(item => {
            initialTasks[item.id] = { id: item.id, content: item.text };
        });

        const initialBoard: KanbanData = {
            tasks: initialTasks,
            columns: {
                'column-1': { id: 'column-1', title: 'Bajarilishi kerak', taskIds: idea.actionableChecklist.items.map(i => i.id) },
                'column-2': { id: 'column-2', title: 'Jarayonda', taskIds: [] },
                'column-3': { id: 'column-3', title: 'Bajarildi', taskIds: [] },
            },
            columnOrder: ['column-1', 'column-2', 'column-3'],
        };
        setBoardData(initialBoard);
    }, [idea]);

    const moveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
        if (!boardData) return;
        const fromColumn = boardData.columns[fromColumnId];
        const toColumn = boardData.columns[toColumnId];

        const newFromTaskIds = fromColumn.taskIds.filter(id => id !== taskId);
        const newToTaskIds = [...toColumn.taskIds, taskId];

        const newBoardData: KanbanData = {
            ...boardData,
            columns: {
                ...boardData.columns,
                [fromColumnId]: { ...fromColumn, taskIds: newFromTaskIds },
                [toColumnId]: { ...toColumn, taskIds: newToTaskIds },
            },
        };
        setBoardData(newBoardData);
    };

    if (!boardData) {
        return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
             {activeTaskForAI && <AIHelperModal task={activeTaskForAI} onClose={() => setActiveTaskForAI(null)} />}
            <div>
                 <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-cyan-500 dark:text-cyan-400 mb-1">Loyiha Boshqaruv Markazi</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Startapingizni shu yerdan boshqaring. Vazifalarni kuzatib boring, KPI'larni tahlil qiling va kerak bo'lganda AI Co-Pilot'dan yordam oling.
                        </p>
                    </div>
                    <div className="flex-shrink-0" title="Grant va akseleratsiya dasturlariga kirish uchun sifat belgisi. Barcha vazifalarni bajarganingizdan so'ng faollashadi.">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/30 cursor-help">
                            Venture Passport: Tasdiqlanmagan
                        </span>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Asosiy Ko'rsatkichlar (KPI)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {idea.leanCanvas.keyMetrics.map((metric, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric}</h5>
                            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">-</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Vazifalar Kengashi (Kanban)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {boardData.columnOrder.map((columnId, colIndex) => {
                        const column = boardData.columns[columnId];
                        const tasks = column.taskIds.map(taskId => boardData.tasks[taskId]);

                        return (
                            <div key={column.id} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-h-[200px]">
                                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">{column.title}</h4>
                                <div className="space-y-2">
                                    {tasks.map(task => (
                                        <div key={task.id} className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm relative">
                                            <p className="text-sm text-gray-900 dark:text-gray-100 pr-8">{task.content}</p>
                                            <button 
                                                onClick={() => setActiveTaskForAI(task)}
                                                className="absolute top-2 right-2 p-1 text-cyan-500 hover:text-cyan-400 rounded-full hover:bg-cyan-100 dark:hover:bg-gray-600 transition-colors"
                                                title="AI Co-Pilot yordami"
                                            >
                                                <MagicWandIcon className="w-5 h-5" />
                                            </button>
                                            <div className="text-xs mt-2 flex gap-2 text-gray-500 dark:text-gray-400">
                                                {colIndex > 0 && <button onClick={() => moveTask(task.id, column.id, boardData.columnOrder[colIndex - 1])} className="hover:text-gray-800 dark:hover:text-white">&larr; Orqaga</button>}
                                                {colIndex < boardData.columnOrder.length - 1 && <button onClick={() => moveTask(task.id, column.id, boardData.columnOrder[colIndex + 1])} className="hover:text-gray-800 dark:hover:text-white">Oldinga &rarr;</button>}
                                            </div>
                                        </div>
                                    ))}
                                    {tasks.length === 0 && <div className="text-center text-xs text-gray-400 dark:text-gray-500 p-4">Bo'sh</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};