import React, { useState, useEffect } from 'react';
import AppLayout from '../Layouts/AppLayout';
import axios from '../lib/axios';

export default function CalendarView() {
    const [project, setProject] = useState(null);
    const [issues, setIssues] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const loadData = async () => {
            try {
                const projRes = await axios.get('/projects');
                if (projRes.data.length > 0) {
                    const firstProjId = projRes.data[0].id;
                    const projDetailRes = await axios.get(`/projects/${firstProjId}`);
                    const issueRes = await axios.get(`/projects/${firstProjId}/issues`);
                    
                    setProject(projDetailRes.data);
                    setColumns(projDetailRes.data.columns);
                    setIssues(issueRes.data);
                }
            } catch (error) {
                console.error('Failed to load calendar data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AppLayout>
        );
    }

    if (!project) {
        return (
            <AppLayout>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-slate-500">No project found for Calendar.</p>
                </div>
            </AppLayout>
        );
    }

    // Process deadlines
    const tasksWithDeadlines = issues.filter(i => i.deadline);
    
    // Calendar logic
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };
    
    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Get tasks for a specific date
    const getTasksForDate = (dateNumber) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateNumber).padStart(2, '0')}`;
        return tasksWithDeadlines.filter(t => {
            const tDate = t.deadline.split('T')[0]; // assuming YYYY-MM-DD
            return tDate === dateStr;
        });
    };

    const doneCol = columns.find(c => c.name.toLowerCase().includes('done'))?.id;

    // Generate grid days
    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
    const totalSlots = [...blanks, ...days];

    return (
        <AppLayout>
            <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
                <header className="h-16 border-b border-slate-border flex items-center justify-between px-8 bg-white shrink-0">
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Calendar</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 min-w-[150px] text-center">
                            {monthNames[month]} {year}
                        </h2>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/80">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-7 flex-1 auto-rows-[minmax(120px,auto)]">
                            {totalSlots.map((day, index) => {
                                if (!day) {
                                    return <div key={`blank-${index}`} className="border-r border-b border-slate-100 bg-slate-50/30"></div>;
                                }
                                
                                const dayTasks = getTasksForDate(day);
                                const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                                
                                return (
                                    <div key={`day-${day}`} className={`border-r border-b border-slate-100 p-2 flex flex-col transition-colors ${isToday ? 'bg-brand/5' : 'hover:bg-slate-50'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${isToday ? 'bg-brand text-white' : 'text-slate-700'}`}>
                                                {day}
                                            </span>
                                            {dayTasks.length > 0 && (
                                                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                    {dayTasks.length} {dayTasks.length === 1 ? 'Deadline' : 'Deadlines'}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[150px] pr-1">
                                            {dayTasks.map(task => {
                                                const isDone = task.board_column_id === doneCol;
                                                return (
                                                    <div 
                                                        key={task.id} 
                                                        className={`p-2 rounded-lg text-xs font-medium border-l-2 flex flex-col gap-1 ${
                                                            isDone 
                                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 opacity-70' 
                                                                : 'bg-white border-slate-200 shadow-sm text-slate-700 hover:border-brand transition-colors'
                                                        }`}
                                                        title={task.summary}
                                                    >
                                                        <div className={`truncate ${isDone ? 'line-through decoration-emerald-300' : ''}`}>
                                                            {task.summary}
                                                        </div>
                                                        <div className="flex justify-between items-center text-[9px] font-bold opacity-75">
                                                            <span className="uppercase">{task.assignee?.name || 'Unassigned'}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
