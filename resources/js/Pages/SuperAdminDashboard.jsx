import React, { useState, useEffect } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

export default function SuperAdminDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const activeTab = queryParams.get('tab') || 'overview';
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
    const [managerForm, setManagerForm] = useState({ name: '', email: '', password: '' });
    const [formError, setFormError] = useState('');
    
    // For Managers Flow Navigation
    const [selectedManager, setSelectedManager] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/super-admin/data');
                setData(res.data);
            } catch (err) {
                console.error("Failed to load admin data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGrantAccess = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await axios.post(`/super-admin/managers`, managerForm);
            setIsGrantModalOpen(false);
            setManagerForm({ name: '', email: '', password: '' });
            const res = await axios.get('/super-admin/data');
            setData(res.data);
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to create manager");
            console.error("Failed to create manager", err);
        }
    };

    const handleRevokeAccess = async (userId) => {
        if (!window.confirm('Are you sure you want to revoke manager access?')) return;
        try {
            await axios.post(`/super-admin/users/${userId}/revoke-manager`);
            const res = await axios.get('/super-admin/data');
            setData(res.data);
        } catch (err) {
            console.error("Failed to revoke access", err);
        }
    };

    if (loading) return (
        <AppLayout>
            <div className="flex-1 flex items-center justify-center bg-surface">
                <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
            </div>
        </AppLayout>
    );

    const renderOverview = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">System Overview</h2>
            
            {data.alerts && data.alerts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
                    <h3 className="text-red-800 font-bold mb-3 flex items-center gap-2">
                        ⚠️ Needs Attention
                    </h3>
                    <div className="space-y-2">
                        {data.alerts.map((alert, idx) => (
                            <p key={idx} className={`text-sm font-medium ${alert.type === 'danger' ? 'text-red-700' : 'text-yellow-700'}`}>
                                {alert.message}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div onClick={() => { setSelectedManager(null); setSelectedProject(null); navigate('?tab=managers'); }} className="bg-white p-5 rounded-2xl border border-slate-border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">👥 Total Managers</p>
                    <p className="text-3xl font-bold text-brand">{data.stats.totalManagers}</p>
                </div>
                <div onClick={() => navigate('?tab=projects')} className="bg-white p-5 rounded-2xl border border-slate-border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">📁 Total Projects</p>
                    <p className="text-3xl font-bold text-indigo-600">{data.stats.totalProjects}</p>
                </div>
                <div onClick={() => navigate('?tab=users')} className="bg-white p-5 rounded-2xl border border-slate-border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">👤 Total Members</p>
                    <p className="text-3xl font-bold text-green-600">{data.stats.totalMembers}</p>
                </div>
                <div onClick={() => navigate('?tab=tasks')} className="bg-white p-5 rounded-2xl border border-slate-border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">📋 Total Tasks</p>
                    <p className="text-3xl font-bold text-slate-900">{data.stats.totalTasks}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                <div onClick={() => navigate('?tab=tasks')} className="bg-white p-6 rounded-3xl border border-slate-border shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col items-center border-b-4 border-b-status-success">
                    <p className="text-sm font-bold text-status-success mb-2 uppercase tracking-wide">Completed</p>
                    <p className="text-4xl font-black text-status-success">{data.stats.completed}</p>
                </div>
                <div onClick={() => navigate('?tab=tasks')} className="bg-white p-6 rounded-3xl border border-slate-border shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col items-center border-b-4 border-b-status-inprogress">
                    <p className="text-sm font-bold text-status-inprogress mb-2 uppercase tracking-wide">In Progress</p>
                    <p className="text-4xl font-black text-status-inprogress">{data.stats.inProgress}</p>
                </div>
                <div onClick={() => navigate('?tab=tasks')} className="bg-white p-6 rounded-3xl border border-slate-border shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col items-center border-b-4 border-b-slate-400">
                    <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Pending</p>
                    <p className="text-4xl font-black text-slate-700">{data.stats.pending}</p>
                </div>
                <div onClick={() => navigate('?tab=tasks')} className="bg-white p-6 rounded-3xl border border-slate-border shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col items-center border-b-4 border-b-red-500">
                    <p className="text-sm font-bold text-red-500 mb-2 uppercase tracking-wide">Overdue</p>
                    <p className="text-4xl font-black text-red-500">{data.stats.overdue}</p>
                </div>
            </div>
                <div onClick={() => navigate('?tab=permissions')} className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-2xl border border-indigo-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow md:col-span-3 flex items-center justify-between mt-4">
                    <div>
                        <p className="text-sm font-bold text-indigo-900 mb-1">Permissions Manager</p>
                        <p className="text-xs text-indigo-600">View and manage team managers who can assign tasks and manage members.</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>


        </div>
    );

    const renderManagersFlow = () => {
        if (selectedProject) {
            // Level 3: Project Team + Tasks
            return (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
                        <button onClick={() => { setSelectedManager(null); setSelectedProject(null); }} className="hover:text-brand">Managers</button>
                        <span>/</span>
                        <button onClick={() => setSelectedProject(null)} className="hover:text-brand">{selectedManager.name}</button>
                        <span>/</span>
                        <span className="font-bold text-slate-900">{selectedProject.name}</span>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-border shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Project: {selectedProject.name}</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 bg-slate-50 p-5 rounded-2xl">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Project Deadline</p>
                                <p className="text-lg font-bold text-slate-900">{selectedProject.deadline}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Today</p>
                                <p className="text-lg font-bold text-slate-900">{new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Progress</p>
                                <p className="text-lg font-bold text-brand">{selectedProject.progress}%</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Remaining Tasks</p>
                                <p className="text-lg font-bold text-slate-900">{selectedProject.tasks_count - selectedProject.completed_tasks}</p>
                            </div>
                            <div className="md:col-span-2 lg:col-span-4 mt-2">
                                <p className="text-sm font-medium text-slate-500 mb-2">Deadline Status</p>
                                <p className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                    selectedProject.status === '✅ Completed' ? 'bg-green-100 text-green-700' :
                                    selectedProject.status === '🔴 Overdue' ? 'bg-red-100 text-red-700' :
                                    selectedProject.status === '🟡 At Risk' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {selectedProject.status}
                                </p>
                            </div>
                        </div>

                        {selectedProject.status === '✅ Completed' || selectedProject.is_late ? (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-8">
                                <h3 className="font-bold text-indigo-900 mb-2">Final Project Result</h3>
                                <p className="text-sm text-indigo-800">Deadline: {selectedProject.deadline}</p>
                                <p className="text-sm text-indigo-800">Completed: {selectedProject.completed_at}</p>
                                <p className="text-base font-bold mt-2">
                                    Result: {selectedProject.is_late ? `🔴 Completed Late (Delay: ${selectedProject.delay_days} Days)` : '✅ Completed On Time'}
                                </p>
                            </div>
                        ) : null}

                        <h3 className="text-lg font-bold text-slate-900 mb-4">Team Members</h3>
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3">Member</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Assigned Tasks</th>
                                        <th className="px-6 py-3">Completed</th>
                                        <th className="px-6 py-3">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {selectedProject.members.map(m => (
                                        <tr key={m.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-bold text-slate-900">{m.name}</td>
                                            <td className="px-6 py-4 text-slate-600">{m.role}</td>
                                            <td className="px-6 py-4 text-slate-600">{m.assigned_tasks}</td>
                                            <td className="px-6 py-4 text-slate-600">{m.completed_tasks}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-brand" style={{width: `${m.progress}%`}}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700">{m.progress}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {selectedProject.members.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-4 text-center text-slate-500">No members assigned</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        if (selectedManager) {
            // Level 2: Manager Overview as requested
            return (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
                        <button onClick={() => setSelectedManager(null)} className="hover:text-brand font-medium">Managers</button>
                        <span>/</span>
                        <span className="font-bold text-slate-900">{selectedManager.name}</span>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-border shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Manager Overview</h2>
                        <h3 className="text-xl font-bold text-brand mb-6 border-b pb-4">Manager: {selectedManager.name}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Projects */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">📁 Projects</h4>
                                <ul className="space-y-3 text-slate-700 font-medium">
                                    {selectedManager.projects_details.map(p => (
                                        <li key={p.id} className="flex items-start gap-3">
                                            <span className="text-slate-400">├──</span> {p.name}
                                        </li>
                                    ))}
                                    {selectedManager.projects_details.length === 0 && <li className="text-slate-400 italic">No projects</li>}
                                </ul>
                            </div>
                            
                            {/* Team Members */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">👥 Team Members</h4>
                                <ul className="space-y-3 text-slate-700 font-medium">
                                    {Array.from(new Set(selectedManager.projects_details.flatMap(p => p.members.map(m => m.name)))).map((member, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-slate-400">├──</span> {member}
                                        </li>
                                    ))}
                                    {selectedManager.members_count === 0 && <li className="text-slate-400 italic">No team members</li>}
                                </ul>
                            </div>

                            {/* Tasks */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">📋 Tasks</h4>
                                <ul className="space-y-3 text-slate-700 font-medium">
                                    <li className="flex items-start justify-between">
                                        <span className="flex gap-3"><span className="text-slate-400">├──</span> To Do</span>
                                        <span className="font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">{selectedManager.projects_details.reduce((acc, p) => acc + p.pending_tasks, 0)}</span>
                                    </li>
                                    <li className="flex items-start justify-between">
                                        <span className="flex gap-3"><span className="text-slate-400">├──</span> In Progress</span>
                                        <span className="font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{selectedManager.tasks_count - selectedManager.completed_tasks - selectedManager.projects_details.reduce((acc, p) => acc + p.pending_tasks, 0)}</span>
                                    </li>
                                    <li className="flex items-start justify-between">
                                        <span className="flex gap-3"><span className="text-slate-400">├──</span> Done</span>
                                        <span className="font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">{selectedManager.completed_tasks}</span>
                                    </li>
                                    <li className="flex items-start justify-between">
                                        <span className="flex gap-3"><span className="text-slate-400">└──</span> Overdue</span>
                                        <span className="font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">{selectedManager.overdue}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Level 1: Manager Overview
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Managers</h2>
                </div>
                
                <div className="bg-white rounded-3xl border border-slate-border overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-border">
                            <tr>
                                <th className="px-6 py-4">Manager</th>
                                <th className="px-6 py-4 text-center">Projects</th>
                                <th className="px-6 py-4 text-center">Members</th>
                                <th className="px-6 py-4">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.managers.map(manager => (
                                <tr key={manager.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedManager(manager)}>
                                    <td className="px-6 py-4 font-bold text-slate-900">{manager.name}</td>
                                    <td className="px-6 py-4 text-center text-slate-600">{manager.projects_count}</td>
                                    <td className="px-6 py-4 text-center text-slate-600">{manager.members_count}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-700 w-10">{manager.progress}%</span>
                                            <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-brand" style={{width: `${manager.progress}%`}}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data.managers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No managers found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderUsers = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">User Management</h2>
            </div>
            <div className="bg-white rounded-3xl border border-slate-border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-border">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Projects</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.users.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                                <td className="px-6 py-4 text-slate-500">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                        u.role === 'manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                    }`}>{u.role}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{u.projects_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderProjects = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Project Management</h2>
            </div>
            <div className="bg-white rounded-3xl border border-slate-border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-border">
                        <tr>
                            <th className="px-6 py-3">Project Name</th>
                            <th className="px-6 py-3">Manager</th>
                            <th className="px-6 py-3">Members</th>
                            <th className="px-6 py-3">Tasks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.projects.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-bold text-slate-900">{p.name}</td>
                                <td className="px-6 py-4 text-slate-900">{p.owner?.name}</td>
                                <td className="px-6 py-4 text-slate-500">{p.members?.length || 0}</td>
                                <td className="px-6 py-4 text-slate-500">{p.issues_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderTasks = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">All Tasks (System-wide)</h2>
            <div className="bg-white rounded-3xl border border-slate-border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-border">
                        <tr>
                            <th className="px-6 py-3">Task</th>
                            <th className="px-6 py-3">Project</th>
                            <th className="px-6 py-3">Manager</th>
                            <th className="px-6 py-3">Member (Assignee)</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.tasks.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{t.summary}</td>
                                <td className="px-6 py-4 text-slate-500">{t.project?.name}</td>
                                <td className="px-6 py-4 text-slate-500">{t.reporter?.name}</td>
                                <td className="px-6 py-4 text-slate-500">{t.assignee?.name || 'Unassigned'}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-semibold">{t.column?.name}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderReports = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Reports & Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-slate-border p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Project Progress</h3>
                    <div className="space-y-4">
                        {data.reports.projectProgress.map(p => (
                            <div key={p.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-semibold text-slate-900">{p.name} <span className="text-slate-400 font-normal">({p.manager})</span></span>
                                    <span className="font-bold text-brand">{p.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand rounded-full transition-all" style={{width: `${p.progress}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-border p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Tasks by Manager</h3>
                    <div className="space-y-4">
                        {data.reports.managerTasks.map((m, i) => (
                            <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                <span className="font-medium text-slate-900">{m.name}</span>
                                <span className="font-bold text-slate-500">{m.tasksCount} tasks</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRoles = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Roles & Permissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl border border-slate-border p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Super Admin</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><span className="text-brand">✓</span> All Permissions</li>
                        <li className="flex items-center gap-2"><span className="text-brand">✓</span> Manage Users</li>
                        <li className="flex items-center gap-2"><span className="text-brand">✓</span> Manage Roles</li>
                        <li className="flex items-center gap-2"><span className="text-brand">✓</span> Task Override</li>
                    </ul>
                </div>
                <div className="bg-white rounded-3xl border border-slate-border p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Manager</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><span className="text-brand">✓</span> Create Task</li>
                        <li className="flex items-center gap-2"><span className="text-brand">✓</span> Assign Task</li>
                        <li className="flex items-center gap-2"><span className="text-brand">✓</span> View Team</li>
                        <li className="flex items-center gap-2"><span className="text-brand">✓</span> View Reports</li>
                        <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Manage Roles</li>
                    </ul>
                </div>
                <div className="bg-white rounded-3xl border border-slate-border p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Team Member</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><span className="text-brand">✓</span> View Own Tasks</li>
                        <li className="flex items-center gap-2"><span className="text-brand">✓</span> Update Own Task</li>
                        <li className="flex items-center gap-2"><span className="text-brand">✓</span> View Team</li>
                        <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Assign Task</li>
                        <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Delete Task</li>
                        <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Manage Users</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderPermissions = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Manager Permissions</h2>
                    <p className="text-sm text-slate-500 mt-1">Only the managers listed below have permission to manage team members and assign tasks.</p>
                </div>
                <button onClick={() => setIsGrantModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">Grant Manager Access</button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-800">Authorized Managers List</h3>
                    <p className="text-xs text-slate-500 mt-1">Verify manager names and email IDs below to ensure the correct personnel are managing projects.</p>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-white text-slate-400 font-medium border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Manager Name</th>
                            <th className="px-6 py-4">Email ID</th>
                            <th className="px-6 py-4">Password</th>
                            <th className="px-6 py-4">Role / Permissions</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.users.filter(u => u.role === 'manager').map(manager => (
                            <tr key={manager.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                                            {manager.name.substring(0,2).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-slate-900">{manager.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium">{manager.email}</td>
                                <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                                    {manager.plain_password ? (
                                        <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 select-all">{manager.plain_password}</span>
                                    ) : (
                                        <span className="text-slate-400 italic">Not set via panel</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold border border-green-200">
                                        Can Manage Tasks & Members
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleRevokeAccess(manager.id)} className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">Revoke Access</button>
                                </td>
                            </tr>
                        ))}
                        {data.users.filter(u => u.role === 'manager').length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                    No authorized managers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <AppLayout>
            <div className="flex-1 overflow-y-auto bg-surface p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10 p-8 bg-white rounded-3xl border border-slate-border shadow-sm flex items-center justify-between relative overflow-hidden">
                        {/* Subtle decorative accent */}
                        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-brand/5 to-transparent pointer-events-none"></div>
                        
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center border border-brand/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                    Super Admin Control Panel
                                </h1>
                                <p className="text-slate-500 mt-1 font-medium">
                                    Manage system-wide settings, authorize managers, and oversee all projects securely.
                                </p>
                            </div>
                        </div>
                    </div>
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'managers' && renderManagersFlow()}
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'projects' && renderProjects()}
                    {activeTab === 'tasks' && renderTasks()}
                    {activeTab === 'reports' && renderReports()}
                    {activeTab === 'roles' && renderRoles()}
                    {activeTab === 'permissions' && renderPermissions()}
                    {activeTab === 'activity' && renderOverview() /* Sharing activity feed with overview for now */}
                </div>
            </div>

            {isGrantModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Create New Manager</h3>
                        <p className="text-sm text-slate-500 mb-6">Enter details to create and authorize a new manager.</p>
                        
                        {formError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleGrantAccess} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                                <input 
                                    type="text"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-900 font-medium"
                                    value={managerForm.name}
                                    onChange={(e) => setManagerForm({...managerForm, name: e.target.value})}
                                    placeholder="e.g. Jane Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                                <input 
                                    type="email"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-900 font-medium"
                                    value={managerForm.email}
                                    onChange={(e) => setManagerForm({...managerForm, email: e.target.value})}
                                    placeholder="jane@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                                <input 
                                    type="password"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-900 font-medium"
                                    value={managerForm.password}
                                    onChange={(e) => setManagerForm({...managerForm, password: e.target.value})}
                                    placeholder="Min. 8 characters"
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsGrantModalOpen(false);
                                        setManagerForm({ name: '', email: '', password: '' });
                                        setFormError('');
                                    }}
                                    className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 transition-colors"
                                >
                                    Create Manager
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
