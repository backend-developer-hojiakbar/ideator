import React, { useState, useEffect } from 'react';
import type { ActionableChecklist as Checklist, ChecklistItem } from '../types';

interface ActionableChecklistProps {
  initialChecklist: Checklist;
}

const STORAGE_KEY_PREFIX = 'checklist_';

export const ActionableChecklist: React.FC<ActionableChecklistProps> = ({ initialChecklist }) => {
  const [checklist, setChecklist] = useState<Checklist>(initialChecklist);
  const storageKey = `${STORAGE_KEY_PREFIX}${initialChecklist.title.replace(/\s+/g, '_')}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setChecklist(JSON.parse(saved));
      }
    } catch (e) {
        console.error("Checklistni localStorage'dan yuklab bo'lmadi", e)
    }
  }, [storageKey, initialChecklist]); // Add initialChecklist to deps to reload if idea changes

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checklist));
  }, [checklist, storageKey]);

  const handleToggle = (itemId: string) => {
    setChecklist(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    }));
  };
  
  const completedCount = checklist.items.filter(item => item.completed).length;
  const totalCount = checklist.items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg animate-fade-in">
      <h3 className="text-xl font-bold text-cyan-500 dark:text-cyan-400 mb-4">{checklist.title}</h3>
      
      <div className="mb-4">
          <div className="flex justify-between mb-1">
              <span className="text-base font-medium text-cyan-700 dark:text-white">Progress</span>
              <span className="text-sm font-medium text-cyan-700 dark:text-white">{completedCount} / {totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-cyan-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
      </div>

      <ul className="space-y-3">
        {checklist.items.map(item => (
          <li key={item.id} className="flex items-center">
            <input
              id={item.id}
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggle(item.id)}
              className="w-5 h-5 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
            />
            <label
              htmlFor={item.id}
              className={`ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer ${item.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
            >
              {item.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
