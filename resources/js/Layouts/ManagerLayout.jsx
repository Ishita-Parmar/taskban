import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../Stores/useAuthStore';

export default function ManagerLayout({ children }) {
    const { user, logout, fetchUser } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [user, fetchUser]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#121212] text-gray-300 font-mono">
            {/* The Outer Border mimicking ASCII art */}
            <div className="flex flex-col flex-1 m-4 border border-gray-500 rounded-sm">
                
                {/* Top Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-gray-500 shrink-0">
                    <div className="text-xl font-bold tracking-widest text-white">TASKBAN</div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-yellow-500">🔔</span>
                        <span>Manager Profile ({user?.name || 'Manager'})</span>
                        <button onClick={logout} className="ml-4 px-2 py-1 border border-gray-600 hover:bg-gray-800 transition-colors text-xs">
                            Logout
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-64 border-r border-gray-500 flex flex-col">
                        <nav className="flex-1 py-6 flex flex-col gap-2">
                            <Link to="/dashboard" className={`px-6 py-2 transition-colors ${location.pathname === '/dashboard' ? 'text-white border-l-2 border-white bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                                Dashboard
                            </Link>
                            <Link to="/projects" className={`px-6 py-2 transition-colors ${location.pathname.startsWith('/projects') ? 'text-white border-l-2 border-white bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                                Projects
                            </Link>
                            <Link to="/my-tasks" className={`px-6 py-2 transition-colors ${location.pathname === '/my-tasks' ? 'text-white border-l-2 border-white bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                                My Tasks
                            </Link>
                            <Link to="/team" className={`px-6 py-2 transition-colors ${location.pathname === '/team' ? 'text-white border-l-2 border-white bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                                Team
                            </Link>
                            <Link to="/reports" className={`px-6 py-2 transition-colors ${location.pathname === '/reports' ? 'text-white border-l-2 border-white bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                                Reports
                            </Link>
                            <Link to="/notifications" className={`px-6 py-2 transition-colors ${location.pathname === '/notifications' ? 'text-white border-l-2 border-white bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                                Notifications
                            </Link>
                            <Link to="/settings" className={`px-6 py-2 transition-colors ${location.pathname === '/settings' ? 'text-white border-l-2 border-white bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                                Settings
                            </Link>
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-8 relative">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
