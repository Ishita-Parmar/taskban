import React, { useState, useEffect } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { Briefcase, CheckCircle, List, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../Stores/useAuthStore';

export default function Dashboard() {
    const { user } = useAuthStore();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('/projects');
                setProjects(res.data);
            } catch (error) {
                console.error('Failed to load projects', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
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

    const totalProjects = projects.length;
    const totalTasks = projects.reduce((acc, p) => acc + (p.issues_count || 0), 0);
    const totalDone = projects.reduce((acc, p) => acc + (p.done_issues_count || 0), 0);

    return (
        <AppLayout>
            <div className="flex-1 overflow-y-auto bg-slate-50/50">
                <header className="h-16 border-b border-slate-border flex items-center justify-between px-8 bg-white shrink-0">
                    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Manager Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">Welcome back,</span>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                {user?.name?.substring(0,2).toUpperCase() || 'M'}
                            </div>
                            <span className="text-sm font-semibold text-slate-900">{user?.name}</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Projects</p>
                                <p className="text-2xl font-bold text-slate-900">{totalProjects}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                                <List size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Tasks</p>
                                <p className="text-2xl font-bold text-slate-900">{totalTasks}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Completed</p>
                                <p className="text-2xl font-bold text-slate-900">{totalDone}</p>
                            </div>
                        </div>
                    </div>

                    {/* The Projects Section has been moved to /projects */}
                </div>
            </div>
        </AppLayout>
    );
}
