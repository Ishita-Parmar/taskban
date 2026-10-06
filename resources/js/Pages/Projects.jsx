import React, { useState, useEffect } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import CreateProjectModal from '../Components/CreateProjectModal';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
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

    return (
        <AppLayout>
            <div className="flex-1 overflow-y-auto bg-slate-50/50">
                <header className="h-16 border-b border-slate-border flex items-center justify-between px-8 bg-white shrink-0">
                    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">All Projects</h1>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors shadow-sm"
                    >
                        Create Project
                    </button>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => {
                            const total = project.issues_count || 0;
                            const done = project.done_issues_count || 0;
                            const progress = total > 0 ? Math.round((done / total) * 100) : 0;

                            return (
                                <div 
                                    key={project.id} 
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm hover:shadow-lg transition-all group flex flex-col cursor-pointer transform hover:-translate-y-1"
                                >
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-brand transition-colors">{project.name}</h3>
                                    
                                    <div className="mt-auto">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-slate-700">{total} Tasks</span>
                                            <span className="font-bold text-brand">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                                            <div 
                                                className="bg-brand h-2 rounded-full transition-all duration-500" 
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {projects.length === 0 && (
                            <div className="col-span-full bg-white p-8 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center text-slate-500">
                                No projects available.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CreateProjectModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSuccess={() => {
                    fetchProjects();
                }}
            />
        </AppLayout>
    );
}
