import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Kanban, List, Settings, BarChart, Calendar, User as UserIcon, Shield, Users, Briefcase, Activity, ShieldCheck, FileText } from 'lucide-react';
import { useAuthStore } from '../Stores/useAuthStore';

export default function AppLayout({ children }) {
    const { user, logout, fetchUser } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [user, fetchUser]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-white">
            {/* Left Sidebar */}
            <aside className="w-64 bg-surface border-r border-slate-border flex flex-col">
                {/* Project Header */}
                <div className="p-4 border-b border-slate-border flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                        T
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900 leading-tight">TaskBan</h2>
                        <p className="text-xs text-slate-500">Software Project</p>
                    </div>
                </div>
                
                {/* Navigation Links */}
                <nav className="flex-1 p-3 space-y-1">
                    {user?.role === 'admin' ? (
                        <>
                            <Link to="/super-admin?tab=overview" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/super-admin' && location.search.includes('tab=overview') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <Shield size={18} />
                                Overview
                            </Link>
                            <Link to="/super-admin?tab=users" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/super-admin' && location.search.includes('tab=users') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <Users size={18} />
                                Users
                            </Link>
                            <Link to="/super-admin?tab=projects" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/super-admin' && location.search.includes('tab=projects') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <Briefcase size={18} />
                                Projects
                            </Link>
                            <Link to="/super-admin?tab=tasks" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/super-admin' && location.search.includes('tab=tasks') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <List size={18} />
                                All Tasks
                            </Link>
                            <Link to="/super-admin?tab=reports" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/super-admin' && location.search.includes('tab=reports') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <BarChart size={18} />
                                Reports
                            </Link>
                            <Link to="/super-admin?tab=activity" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/super-admin' && location.search.includes('tab=activity') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <Activity size={18} />
                                Activity Log
                            </Link>
                            <Link to="/super-admin?tab=roles" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/super-admin' && location.search.includes('tab=roles') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <ShieldCheck size={18} />
                                Roles & Permissions
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/dashboard' ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <Activity size={18} />
                                Dashboard
                            </Link>
                            <Link to="/projects" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname.startsWith('/projects') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <Briefcase size={18} />
                                Projects
                            </Link>
                            <Link to="/my-tasks" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/my-tasks' ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <List size={18} />
                                My Tasks
                            </Link>
                            <Link to="/team" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/team' ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <Users size={18} />
                                Team
                            </Link>
                            <Link to="/reports" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/reports' ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <BarChart size={18} />
                                Reports
                            </Link>
                            <Link to="/notifications" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/notifications' ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <ShieldCheck size={18} />
                                Notifications
                            </Link>
                            <Link to="/settings" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/settings' ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover'}`}>
                                <Settings size={18} />
                                Settings
                            </Link>
                        </>
                    )}
                </nav>
                
                {/* User Info / Logout */}
                <div className="p-4 border-t border-slate-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                {user?.name?.substring(0,2).toUpperCase() || 'U'}
                            </div>
                            <div className="text-sm font-medium text-slate-900 truncate w-24">{user?.name}</div>
                        </div>
                        <button onClick={logout} className="text-xs text-slate-500 hover:text-brand font-medium">Logout</button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-white">
                {children}
            </main>
        </div>
    );
}
