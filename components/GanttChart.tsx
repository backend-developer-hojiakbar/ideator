
import React, { useMemo, useRef, useEffect, useState } from 'react';
import type { ProjectRoadmap, RoadmapTask } from '../types';

// Helper functions to replace date-fns
const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  // JavaScript months are 0-indexed
  return new Date(Date.UTC(year, month - 1, day));
};

const addDaysToDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const getDayDifference = (date1: Date, date2: Date): number => {
    // To ignore time part and time zone issues, work with UTC dates
    const utc1 = Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate());
    const utc2 = Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate());
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

const formatDate = (date: Date, formatStr: string): string => {
    const monthNames = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
    const monthNamesFull = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
    
    if (formatStr === 'dd MMM') {
        return `${date.getUTCDate()} ${monthNames[date.getUTCMonth()]}`;
    }
    if (formatStr === 'MMMM yyyy') {
        return `${monthNamesFull[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
    }
    return date.toDateString();
};


// A utility to get all tasks in a flat array with phase info
const flattenTasks = (roadmap: ProjectRoadmap) => {
  return roadmap.phases.flatMap(phase => 
    phase.tasks.map(task => ({ ...task, phaseName: phase.name }))
  );
};

// Colors for phases
const phaseColors = [
  '#34d399', // emerald-400
  '#60a5fa', // blue-400
  '#fbbf24', // amber-400
  '#f87171', // red-400
  '#a78bfa', // violet-400
  '#22d3ee', // cyan-400
];

const getPhaseColor = (index: number) => phaseColors[index % phaseColors.length];

// Tooltip Component
const Tooltip: React.FC<{ task: RoadmapTask, position: { top: number, left: number } }> = ({ task, position }) => {
    if (!position.top) return null;
    const startDate = parseDate(task.startDate);
    const endDate = addDaysToDate(startDate, task.durationDays > 0 ? task.durationDays - 1 : 0);

    return (
        <div 
            className="fixed z-50 p-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg pointer-events-none transition-opacity duration-200"
            style={{ top: position.top, left: position.left, transform: 'translateY(-110%)' }}
        >
            <div className="font-bold">{task.name}</div>
            <div>Boshlanish: {formatDate(startDate, 'dd MMM')}</div>
            <div>Tugash: {formatDate(endDate, 'dd MMM')}</div>
            <div>Davomiyligi: {task.durationDays} kun</div>
        </div>
    );
};


export const GanttChart: React.FC<{ roadmap: ProjectRoadmap }> = ({ roadmap }) => {
  const [tooltip, setTooltip] = useState<{ task: RoadmapTask, position: { top: number, left: number } } | null>(null);
  const taskElements = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [dependencyLines, setDependencyLines] = useState<string[]>([]);

  const allTasks = useMemo(() => flattenTasks(roadmap), [roadmap]);
  const taskMap = useMemo(() => new Map(allTasks.map(task => [task.id, task])), [allTasks]);
  
  const { startDate, endDate, totalDays } = useMemo(() => {
    if (allTasks.length === 0) {
      const now = new Date();
      return { startDate: now, endDate: addDaysToDate(now, 30), totalDays: 30 };
    }

    const startDates = allTasks.map(t => parseDate(t.startDate));
    const endDates = allTasks.map(t => addDaysToDate(parseDate(t.startDate), t.durationDays));
    
    const minDate = new Date(Math.min(...startDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...endDates.map(d => d.getTime())));
    
    return {
      startDate: minDate,
      endDate: maxDate,
      totalDays: getDayDifference(minDate, maxDate) + 5 // Add padding
    };
  }, [allTasks]);

  const monthHeaders = useMemo(() => {
    const months: { name: string, days: number }[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const monthName = formatDate(currentDate, 'MMMM yyyy');
        const endOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0));
        
        const daysInMonth = getDayDifference(currentDate, endOfMonth) + 1;
        const remainingDays = getDayDifference(currentDate, endDate) + 1;
        const days = Math.min(daysInMonth, remainingDays);

        months.push({ name: monthName, days });
        currentDate = addDaysToDate(currentDate, days);
    }
    return months;
  }, [startDate, endDate]);

  useEffect(() => {
    const calculateLines = () => {
        if (!containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLines: string[] = [];
        
        allTasks.forEach(task => {
            if (task.dependencies && task.dependencies.length > 0) {
                task.dependencies.forEach(depId => {
                    const fromTaskEl = taskElements.current[depId];
                    const toTaskEl = taskElements.current[task.id];

                    if (fromTaskEl && toTaskEl) {
                        const fromRect = fromTaskEl.getBoundingClientRect();
                        const toRect = toTaskEl.getBoundingClientRect();
                        
                        const fromX = fromRect.right - containerRect.left;
                        const fromY = fromRect.top - containerRect.top + fromRect.height / 2;
                        
                        const toX = toRect.left - containerRect.left;
                        const toY = toRect.top - containerRect.top + toRect.height / 2;
                        
                        const path = `M ${fromX} ${fromY} C ${fromX + 20} ${fromY}, ${toX - 20} ${toY}, ${toX} ${toY}`;
                        newLines.push(path);
                    }
                });
            }
        });
        setDependencyLines(newLines);
    };

    const timeoutId = setTimeout(calculateLines, 100); // Allow DOM to render
    window.addEventListener('resize', calculateLines);
    return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', calculateLines);
    }
  }, [allTasks, taskMap, startDate, totalDays]);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>, task: RoadmapTask) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ task, position: { top: rect.top, left: rect.left } });
  };
  
  const handleMouseOut = () => {
    setTooltip(null);
  };

  if(allTasks.length === 0) {
    return <div className="p-4 text-center text-gray-500">Yo'l xaritasi ma'lumotlari mavjud emas.</div>
  }
  
  return (
    <div className="relative w-full overflow-x-auto text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900" ref={containerRef}>
      {tooltip && <Tooltip task={tooltip.task} position={tooltip.position} />}
      <div className="grid min-w-max" style={{ gridTemplateColumns: `250px repeat(${totalDays}, minmax(35px, 1fr))` }}>
          {/* Header Row: Task Name */}
          <div className="sticky left-0 z-20 p-2 font-semibold bg-gray-100 dark:bg-gray-800 border-b border-r border-gray-300 dark:border-gray-600">Vazifa</div>
          {/* Header Row: Months */}
          {monthHeaders.map((month, index) => (
            <div key={index} className="p-2 text-center font-semibold bg-gray-100 dark:bg-gray-800 border-b border-l border-gray-300 dark:border-gray-600" style={{ gridColumn: `span ${month.days}` }}>
              {month.name}
            </div>
          ))}

          {/* Render Phases and Tasks */}
          {roadmap.phases.map((phase, phaseIndex) => (
            <React.Fragment key={phase.name}>
              {/* Phase Header Row */}
              <div className="sticky left-0 z-10 p-2 font-bold bg-gray-200 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600" style={{ gridRow: `span ${phase.tasks.length + 1}`}}>
                {phase.name}
              </div>
              <div className={`col-span-full h-8 bg-gray-200/50 dark:bg-gray-700/50 border-b border-gray-300 dark:border-gray-600`} style={{ gridColumn: `2 / -1`}} ></div>

              {/* Task Rows */}
              {phase.tasks.map((task) => {
                const dayStart = getDayDifference(startDate, parseDate(task.startDate)) + 2; // +1 for 1-based index, +1 for task name column
                return (
                  <React.Fragment key={task.id}>
                    <div className="sticky left-0 z-10 p-2 truncate bg-white dark:bg-gray-900 border-r border-b border-gray-300 dark:border-gray-600" title={task.name}>
                        {task.name}
                    </div>
                    <div className="relative border-b border-gray-200 dark:border-gray-700" style={{ gridColumn: `${dayStart} / span ${task.durationDays}` }}>
                         <div
                            ref={(el) => (taskElements.current[task.id] = el)}
                            onMouseOver={(e) => handleMouseOver(e, task)}
                            onMouseOut={handleMouseOut}
                            className="absolute h-6 top-1/2 -translate-y-1/2 rounded-md flex items-center px-2 cursor-pointer transition-all duration-200 hover:brightness-110 w-full"
                            style={{
                                backgroundColor: getPhaseColor(phaseIndex)
                            }}
                        >
                            <span className="text-white text-xs font-medium truncate">{task.name}</span>
                        </div>
                    </div>
                    {/* Empty cells for the rest of the row */}
                    <div className="border-b border-gray-200 dark:border-gray-700" style={{ gridColumn: `2 / ${dayStart}`}}></div>
                    <div className="border-b border-gray-200 dark:border-gray-700" style={{ gridColumn: `${dayStart + task.durationDays} / -1`}}></div>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
      </div>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
          </marker>
        </defs>
        {dependencyLines.map((path, i) => (
          <path key={i} d={path} stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
        ))}
      </svg>
    </div>
  );
};
