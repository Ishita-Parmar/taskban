import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../Layouts/AppLayout';

export default function MemberDashboard() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <AppLayout>
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
                    <p className="text-slate-500 mb-4">No member data provided.</p>
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="px-5 py-2 bg-brand text-white rounded-full font-semibold"
                    >
                        Go back to Dashboard
                    </button>
                </div>
            </AppLayout>
        );
    }

    const { member, issues, project, columns } = state;

    // Categorize tasks
    const inProgressCol = columns.find(c => c.name.toLowerCase().includes('progress'))?.id;
    const doneCol = columns.find(c => c.name.toLowerCase().includes('done'))?.id;
    const todoCol = columns.find(c => c.name.toLowerCase().includes('do'))?.id;

    const inProgressTasks = issues.filter(i => i.board_column_id === inProgressCol);
    const doneTasks = issues.filter(i => i.board_column_id === doneCol);
    const todoTasks = issues.filter(i => i.board_column_id === todoCol);

    const totalTasks = issues.length;
    const progressPercentage = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

    return (
        <AppLayout>
            <div className="flex-1 overflow-y-auto bg-slate-50/50">
                {/* Header Profile Section */}
                <header className="bg-white border-b border-slate-200 px-8 py-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-tr from-brand to-blue-500 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-brand/20">
                                {member.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{member.name}</h1>
                                <p className="text-slate-500 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active on {project.name}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-full transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Board
                        </button>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand/30 transition-colors">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Tasks</p>
                                <p className="text-3xl font-black text-slate-900">{totalTasks}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-brand transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">In Progress</p>
                                <p className="text-3xl font-black text-slate-900">{inProgressTasks.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 group-hover:text-blue-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Completed</p>
                                <p className="text-3xl font-black text-slate-900">{doneTasks.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-400 group-hover:text-emerald-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-brand to-blue-600 p-6 rounded-3xl shadow-lg shadow-brand/20 flex flex-col justify-center relative overflow-hidden text-white">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <p className="text-sm font-bold text-white/80 uppercase tracking-wider mb-1 relative z-10">Overall Progress</p>
                            <div className="flex items-end gap-2 relative z-10">
                                <p className="text-4xl font-black">{progressPercentage}%</p>
                            </div>
                            <div className="h-1.5 w-full bg-black/20 rounded-full mt-3 overflow-hidden relative z-10">
                                <div className="h-full bg-white rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Current Focus (In Progress) */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                                    Current Focus
                                </h2>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full">{inProgressTasks.length} Tasks</span>
                            </div>
                            <div className="p-6 flex-1 bg-white">
                                {inProgressTasks.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                                        <svg className="w-12 h-12 mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                                        <p>Nothing in progress right now.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {inProgressTasks.map(task => (
                                            <div key={task.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-300 transition-colors group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{task.summary}</h3>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${task.priority === 'high' ? 'bg-rose-100 text-rose-700' : task.priority === 'low' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{task.description || 'No detailed description.'}</p>
                                                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-t border-slate-200 pt-3">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                        Assigned by {task.reporter?.name || 'Manager'}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-slate-600">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Upcoming Tasks (To Do) */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                        Up Next
                                    </h2>
                                    <span className="px-2 py-1 bg-slate-200 text-slate-700 font-bold text-xs rounded-full">{todoTasks.length}</span>
                                </div>
                                <div className="p-2 bg-white max-h-[300px] overflow-y-auto">
                                    {todoTasks.length === 0 ? (
                                        <p className="text-center text-sm text-slate-400 py-6">No upcoming tasks.</p>
                                    ) : (
                                        <ul className="divide-y divide-slate-100">
                                            {todoTasks.map(task => (
                                                <li key={task.id} className="p-3 hover:bg-slate-50 transition-colors flex items-center justify-between group rounded-xl">
                                                    <div>
                                                        <p className="font-semibold text-slate-800 text-sm">{task.summary}</p>
                                                        <p className="text-xs font-medium text-slate-400 mt-0.5">Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${task.priority === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                                        {task.priority}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Completed Tasks */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        Recently Completed
                                    </h2>
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">{doneTasks.length}</span>
                                </div>
                                <div className="p-2 bg-white max-h-[300px] overflow-y-auto">
                                    {doneTasks.length === 0 ? (
                                        <p className="text-center text-sm text-slate-400 py-6">No completed tasks yet.</p>
                                    ) : (
                                        <ul className="divide-y divide-slate-100">
                                            {doneTasks.map(task => (
                                                <li key={task.id} className="p-3 hover:bg-emerald-50/50 transition-colors flex items-center gap-3 rounded-xl opacity-80 hover:opacity-100">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-700 text-sm line-through decoration-slate-300">{task.summary}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
