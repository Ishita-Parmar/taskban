import React from 'react';
import { Link } from 'react-router-dom';
import { Kanban, List, Settings } from 'lucide-react';
import { useAuthStore } from '../Stores/useAuthStore';

export default function AppLayout({ children }) {
    const { user, logout } = useAuthStore();

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
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-brand bg-surface-hover font-medium rounded-xl">
                        <Kanban size={18} />
                        Kanban Board
                    </Link>
                    <Link to="#" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-500 hover:bg-surface-hover rounded-xl transition-colors">
                        <List size={18} />
                        Backlog
                    </Link>
                    <Link to="#" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-500 hover:bg-surface-hover rounded-xl transition-colors">
                        <Settings size={18} />
                        Project Settings
                    </Link>
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
