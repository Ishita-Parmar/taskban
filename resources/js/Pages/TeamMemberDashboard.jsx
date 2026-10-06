import React, { useState, useEffect } from 'react';
import AppLayout from '../Layouts/AppLayout';
import axios from '../lib/axios';
import IssueDetailsCard from '../Components/IssueDetailsCard';
import { useAuthStore } from '../Stores/useAuthStore';
import { Clock, CheckCircle, Circle, AlertCircle, ArrowRight, Activity, Calendar as CalendarIcon, List } from 'lucide-react';

export default function TeamMemberDashboard() {
    const { user } = useAuthStore();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get('/my-tasks');
                setIssues(res.data.issues || []);
                
                // Fetch columns to allow status changes
                if (res.data.issues && res.data.issues.length > 0) {
                    const projectId = res.data.issues[0].project_id;
                    const projRes = await axios.get(`/projects/${projectId}`);
                    setColumns(projRes.data.columns || []);
                }
            } catch (error) {
                console.error('Failed to fetch tasks', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleIssueUpdate = (issueId, payload, type = 'comment') => {
        const updateFn = (issue) => {
            if (issue.id === issueId) {
                if (type === 'comment') {
                    return { ...issue, comments: [...(issue.comments || []), payload] };
                } else if (type === 'issue') {
                    return { ...issue, ...payload };
                }
            }
            return issue;
        };

        setIssues(issues.map(updateFn));
        if (selectedIssue && selectedIssue.id === issueId) {
            setSelectedIssue(updateFn(selectedIssue));
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AppLayout>
        );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getIssueStatus = (columnName) => {
        const lower = (columnName || '').toLowerCase();
        if (lower === 'done' || lower === 'completed') return 'Done';
        if (lower === 'in progress') return 'In Progress';
        return 'To Do';
    };

    const isOverdue = (deadline) => {
        if (!deadline) return false;
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        return deadlineDate < today;
    };

    const isDueToday = (deadline) => {
        if (!deadline) return false;
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        return deadlineDate.getTime() === today.getTime();
    };
    
    const getDaysLeft = (deadline) => {
        if (!deadline) return null;
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0,0,0,0);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const todoIssues = issues.filter(i => getIssueStatus(i.column?.name) === 'To Do');
    const inProgressIssues = issues.filter(i => getIssueStatus(i.column?.name) === 'In Progress');
    const completedIssues = issues.filter(i => getIssueStatus(i.column?.name) === 'Done');
    const overdueIssues = issues.filter(i => isOverdue(i.deadline) && getIssueStatus(i.column?.name) !== 'Done');

    const totalCount = issues.length;
    const inProgressCount = inProgressIssues.length;
    const completedCount = completedIssues.length;
    const overdueCount = overdueIssues.length;

    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    const primaryProjectName = issues.length > 0 ? issues[0].project?.name : 'General';
    
    const todaysFocus = issues.filter(i => (isDueToday(i.deadline) || isOverdue(i.deadline)) && getIssueStatus(i.column?.name) !== 'Done');
    
    const upcomingDeadlines = issues
        .filter(i => i.deadline && getIssueStatus(i.column?.name) !== 'Done' && !isOverdue(i.deadline))
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);

    return (
        <AppLayout>
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    
                    {/* 1. Top Welcome Section */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Good Morning, {user?.name?.split(' ')[0] || 'User'} 👋
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">
                            Here’s your work overview for today.
                        </p>
                        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-semibold border border-brand/20">
                            Project: {primaryProjectName}
                        </div>
                    </div>

                    {/* 2. 4 Important Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 text-slate-600 mb-4">
                                <List className="w-5 h-5" />
                                <span className="font-semibold">My Tasks</span>
                            </div>
                            <span className="text-4xl font-bold text-slate-900">{totalCount}</span>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 text-blue-600 mb-4">
                                <Activity className="w-5 h-5" />
                                <span className="font-semibold">In Progress</span>
                            </div>
                            <span className="text-4xl font-bold text-slate-900">{inProgressCount}</span>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 text-emerald-600 mb-4">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-semibold">Completed</span>
                            </div>
                            <span className="text-4xl font-bold text-slate-900">{completedCount}</span>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl border border-red-200 bg-red-50/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 text-red-600 mb-4">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-semibold">Overdue</span>
                            </div>
                            <span className="text-4xl font-bold text-red-600">{overdueCount}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-2 space-y-8">
                            {/* 3. My Tasks (Table) */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h2 className="text-xl font-bold text-slate-900">⭐ My Tasks</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-4">Task</th>
                                                <th className="px-6 py-4">Project</th>
                                                <th className="px-6 py-4">Priority</th>
                                                <th className="px-6 py-4">Due Date</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {issues.slice(0, 5).map(issue => (
                                                <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors group">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{issue.summary}</td>
                                                    <td className="px-6 py-4 text-slate-600">{issue.project?.name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                                                            issue.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                            issue.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-slate-100 text-slate-700'
                                                        }`}>
                                                            {issue.priority || 'Low'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        {issue.deadline ? new Date(issue.deadline).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}) : 'No date'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            {getIssueStatus(issue.column?.name) === 'Done' ? <CheckCircle className="w-4 h-4 text-emerald-500"/> :
                                                             getIssueStatus(issue.column?.name) === 'In Progress' ? <Circle className="w-4 h-4 text-blue-500 fill-blue-500"/> :
                                                             <Circle className="w-4 h-4 text-slate-300"/>}
                                                            <span className="font-medium text-slate-700">{issue.column?.name || 'To Do'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => setSelectedIssue(issue)}
                                                            className="text-brand font-medium hover:text-brand-dark flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                                                        >
                                                            View Task <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {issues.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                                        No tasks assigned yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 4. "My Work" Kanban */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                    <h2 className="text-xl font-bold text-slate-900">My Work Kanban</h2>
                                </div>
                                <div className="p-6 grid grid-cols-3 gap-6">
                                    
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">To Do</div>
                                        <div className="space-y-3">
                                            {todoIssues.slice(0,4).map(issue => (
                                                <div key={issue.id} onClick={() => setSelectedIssue(issue)} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-800 cursor-pointer hover:border-brand transition-colors">
                                                    {issue.summary}
                                                </div>
                                            ))}
                                            {todoIssues.length === 0 && <div className="text-sm text-slate-400">Empty</div>}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">In Progress</div>
                                        <div className="space-y-3">
                                            {inProgressIssues.slice(0,4).map(issue => (
                                                <div key={issue.id} onClick={() => setSelectedIssue(issue)} className="bg-white p-3 rounded-lg shadow-sm border border-blue-200 text-sm font-medium text-slate-800 cursor-pointer hover:border-blue-400 transition-colors">
                                                    {issue.summary}
                                                </div>
                                            ))}
                                            {inProgressIssues.length === 0 && <div className="text-sm text-slate-400">Empty</div>}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-emerald-200 pb-2">Done</div>
                                        <div className="space-y-3">
                                            {completedIssues.slice(0,4).map(issue => (
                                                <div key={issue.id} onClick={() => setSelectedIssue(issue)} className="bg-white p-3 rounded-lg shadow-sm border border-emerald-200 text-sm font-medium text-slate-800 cursor-pointer hover:border-emerald-400 transition-colors line-through opacity-70">
                                                    {issue.summary}
                                                </div>
                                            ))}
                                            {completedIssues.length === 0 && <div className="text-sm text-slate-400">Empty</div>}
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className="space-y-8">
                            {/* 5. Today's Focus */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">🔥 Today's Focus</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {todaysFocus.length > 0 ? (
                                        todaysFocus.map(issue => (
                                            <div key={issue.id} onClick={() => setSelectedIssue(issue)} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                                <div className={`mt-0.5 w-3 h-3 rounded-full ${issue.priority === 'high' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900">{issue.summary}</h4>
                                                    <div className="flex gap-3 text-xs mt-1 text-slate-500 font-medium">
                                                        <span>Due: {isOverdue(issue.deadline) ? <span className="text-red-500">Overdue</span> : 'Today'}</span>
                                                        <span>•</span>
                                                        <span className="capitalize">Priority: {issue.priority || 'Medium'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            No critical tasks for today.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 6. Upcoming Deadlines */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                    <h2 className="text-lg font-bold text-slate-900">Upcoming Deadlines</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {upcomingDeadlines.length > 0 ? (
                                        upcomingDeadlines.map(issue => {
                                            const daysLeft = getDaysLeft(issue.deadline);
                                            return (
                                                <div key={issue.id} className="flex items-center justify-between group cursor-pointer" onClick={() => setSelectedIssue(issue)}>
                                                    <div>
                                                        <h4 className="font-medium text-slate-800 group-hover:text-brand transition-colors">{issue.summary}</h4>
                                                        <p className="text-xs text-slate-500">{new Date(issue.deadline).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}</p>
                                                    </div>
                                                    <div className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                                        daysLeft === 0 ? 'bg-red-100 text-red-700' :
                                                        daysLeft === 1 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {daysLeft === 0 ? 'Due Today' : daysLeft === 1 ? 'Due Tomorrow' : `${daysLeft} days left`}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm text-slate-500">No upcoming deadlines.</p>
                                    )}
                                </div>
                            </div>

                            {/* 7. My Progress */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest text-sm">My Progress</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm"><span className="text-slate-600 font-medium">Completed</span><span className="font-bold text-slate-900">{completedCount}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-slate-600 font-medium">In Progress</span><span className="font-bold text-slate-900">{inProgressCount}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-slate-600 font-medium">To Do</span><span className="font-bold text-slate-900">{todoCount}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-slate-600 font-medium">Overdue</span><span className="font-bold text-red-600">{overdueCount}</span></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Overall Progress</span>
                                            <span className="text-lg font-bold text-emerald-600">{progressPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                            <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 8. Recent Activity */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                    <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                                </div>
                                <div className="p-6 space-y-5">
                                    {/* Using mocked activity as requested in requirements for UI demonstration, but could be dynamic later */}
                                    <div className="flex gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-800">You completed <span className="font-semibold">"Login Page"</span></p>
                                            <p className="text-xs text-slate-500 mt-0.5">20 minutes ago</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-800">Manager assigned <span className="font-semibold">"API Testing"</span></p>
                                            <p className="text-xs text-slate-500 mt-0.5">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                            <Activity className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-800">You changed <span className="font-semibold">"Dashboard UI"</span></p>
                                            <p className="text-xs text-slate-500 mt-0.5">Yesterday</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Task Details Modal */}
            {selectedIssue && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 transform transition-all scale-100 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold text-slate-900">Task Details</h3>
                            <button 
                                onClick={() => setSelectedIssue(null)}
                                className="p-2 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2">
                            <IssueDetailsCard 
                                issue={selectedIssue} 
                                colName={selectedIssue.column?.name || 'Unknown'} 
                                columns={columns} 
                                project={selectedIssue.project}
                                onUpdate={handleIssueUpdate} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
