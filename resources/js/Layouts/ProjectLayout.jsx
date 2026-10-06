import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Kanban, List, BarChart, Users, Settings, Activity, ArrowLeft, Target } from 'lucide-react';
import { useAuthStore } from '../Stores/useAuthStore';
import axios from '../lib/axios';

export default function ProjectLayout({ children }) {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`/projects/${id}`);
                setProject(res.data);
            } catch (error) {
                console.error('Failed to fetch project for layout', error);
                navigate('/dashboard');
            }
        };
        if (id) {
            fetchProject();
        }
    }, [id, navigate]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-white">
            {/* Left Sidebar */}
            <aside className="w-64 bg-surface border-r border-slate-border flex flex-col">
                {/* Back to all projects */}
                <div className="p-4 border-b border-slate-border">
                    <Link to="/projects" className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand transition-colors mb-4">
                        <ArrowLeft size={14} /> Back to Projects
                    </Link>
                    
                    {/* Project Header Info */}
                    {project ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 font-bold text-sm shadow-sm">
                                {project.key}
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="font-bold text-slate-900 leading-tight truncate" title={project.name}>{project.name}</h2>
                                <p className="text-[11px] text-slate-500 font-medium">Software Project</p>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-pulse flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Navigation Links */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <div className="px-3 pb-2 pt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Planning</span>
                    </div>
                    
                    <Link to={`/project-workspace/${id}/overview`} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname.includes('/overview') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover hover:text-slate-900'}`}>
                        <Activity size={18} />
                        Overview
                    </Link>
                    
                    <Link to={`/project-workspace/${id}/board`} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname.includes('/board') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover hover:text-slate-900'}`}>
                        <Kanban size={18} />
                        Board
                    </Link>
                    
                    <Link to={`/project-workspace/${id}/backlog`} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname.includes('/backlog') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover hover:text-slate-900'}`}>
                        <List size={18} />
                        Backlog
                    </Link>
                    
                    <Link to={`/project-workspace/${id}/issues`} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname.includes('/issues') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover hover:text-slate-900'}`}>
                        <Target size={18} />
                        Issues
                    </Link>
                    
                    <div className="px-3 pb-2 pt-6">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Management</span>
                    </div>
                    
                    <Link to={`/project-workspace/${id}/team`} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname.includes('/team') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover hover:text-slate-900'}`}>
                        <Users size={18} />
                        Team
                    </Link>
                    
                    <Link to={`/project-workspace/${id}/reports`} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname.includes('/reports') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover hover:text-slate-900'}`}>
                        <BarChart size={18} />
                        Reports
                    </Link>
                    
                    <div className="px-3 pb-2 pt-6">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Configuration</span>
                    </div>

                    <Link to={`/project-workspace/${id}/settings`} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${location.pathname.includes('/settings') ? 'text-brand bg-surface-hover' : 'text-slate-500 hover:bg-surface-hover hover:text-slate-900'}`}>
                        <Settings size={18} />
                        Settings
                    </Link>
                </nav>
                
                {/* User Info / Logout */}
                <div className="p-4 border-t border-slate-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
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
