import React, { useState, useEffect } from 'react';
import AppLayout from '../Layouts/AppLayout';
import axios from '../lib/axios';

export default function Reports() {
    const [project, setProject] = useState(null);
    const [issues, setIssues] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);

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
                console.error('Failed to load reports data', error);
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
                    <p className="text-slate-500">No project found to generate reports.</p>
                </div>
            </AppLayout>
        );
    }

    // Calculate Project Progress
    const doneCol = columns.find(c => c.name.toLowerCase().includes('done'))?.id;
    const inProgressCol = columns.find(c => c.name.toLowerCase().includes('progress'))?.id;
    const todoCol = columns.find(c => c.name.toLowerCase().includes('do'))?.id;

    const totalTasks = issues.length;
    const doneTasks = issues.filter(i => i.board_column_id === doneCol).length;
    const inProgressTasks = issues.filter(i => i.board_column_id === inProgressCol).length;
    const todoTasks = issues.filter(i => i.board_column_id === todoCol).length;

    // Calculate Team Performance (Completed tasks per member)
    const teamPerformance = {};
    if (project.members) {
        project.members.forEach(member => {
            teamPerformance[member.id] = {
                name: member.name,
                completed: 0,
                inProgress: 0,
            };
        });
    }

    issues.forEach(issue => {
        if (issue.assignee_id && teamPerformance[issue.assignee_id]) {
            if (issue.board_column_id === doneCol) {
                teamPerformance[issue.assignee_id].completed += 1;
            } else if (issue.board_column_id === inProgressCol) {
                teamPerformance[issue.assignee_id].inProgress += 1;
            }
        }
    });

    const sortedTeam = Object.values(teamPerformance).sort((a, b) => b.completed - a.completed);

    return (
        <AppLayout>
            <div className="flex-1 overflow-y-auto bg-slate-50/50">
                <header className="h-16 border-b border-slate-border flex items-center px-8 bg-white shrink-0">
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Project Reports</h1>
                </header>

                <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">
                    
                    {/* Project Progress */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </span>
                            Project Progress
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Tasks</p>
                                <p className="text-4xl font-black text-slate-900">{totalTasks}</p>
                                <div className="absolute -right-4 -bottom-4 opacity-5">
                                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-500/20 text-white flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <p className="text-sm font-bold text-emerald-100 uppercase tracking-wider mb-1">Done</p>
                                <p className="text-4xl font-black">{doneTasks}</p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden border-l-4 border-l-blue-500">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">In Process</p>
                                <p className="text-4xl font-black text-slate-900">{inProgressTasks}</p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden border-l-4 border-l-slate-300">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">To-Do</p>
                                <p className="text-4xl font-black text-slate-900">{todoTasks}</p>
                            </div>
                        </div>
                    </div>

                    {/* Team Performance */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 mt-12">
                            <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </span>
                            Team Productivity Profile
                        </h2>
                        <p className="text-sm text-slate-500 mb-6 bg-slate-100 p-4 rounded-xl border border-slate-200 inline-block">
                            <strong className="text-slate-700">Note:</strong> This provides neutral productivity information showing task completion volumes across the team.
                        </p>

                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                                            <th className="p-5 font-semibold">Team Member</th>
                                            <th className="p-5 font-semibold">Tasks Completed</th>
                                            <th className="p-5 font-semibold">Tasks In Progress</th>
                                            <th className="p-5 font-semibold">Completion Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {sortedTeam.map((member, index) => {
                                            const maxCompleted = Math.max(...sortedTeam.map(m => m.completed), 1);
                                            const widthPercent = (member.completed / maxCompleted) * 100;
                                            
                                            return (
                                                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand to-blue-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                                                {member.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="font-semibold text-slate-900">{member.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className="inline-flex items-center gap-2 font-black text-lg text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                            {member.completed}
                                                        </span>
                                                        <span className="text-slate-400 text-xs ml-2 font-medium">completed</span>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className="font-bold text-slate-600">{member.inProgress}</span>
                                                        <span className="text-slate-400 text-xs ml-2 font-medium">in progress</span>
                                                    </td>
                                                    <td className="p-5 w-[30%]">
                                                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                                            <div 
                                                                className="bg-brand h-2.5 rounded-full" 
                                                                style={{ width: `${widthPercent}%` }}
                                                            ></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {sortedTeam.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                                    No team members found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
