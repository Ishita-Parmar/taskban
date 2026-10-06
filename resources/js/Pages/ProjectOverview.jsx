import React, { useState, useEffect } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import CreateProjectModal from '../Components/CreateProjectModal';

export default function ProjectOverview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchProject = async () => {
        try {
            const res = await axios.get(`/projects/${id}`);
            setProject(res.data);
        } catch (error) {
            console.error('Failed to load project details', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

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
                <div className="flex-1 flex items-center justify-center text-slate-500">
                    Project not found.
                </div>
            </AppLayout>
        );
    }

    // Determine Project Type dynamically
    const pName = project.name.toLowerCase();
    let projectType = "Software Project";
    if (pName.includes('web') || pName.includes('site') || pName.includes('landing')) {
        projectType = "Web Development";
    } else if (pName.includes('app') || pName.includes('mobile') || pName.includes('ios') || pName.includes('android')) {
        projectType = "App Development";
    }

    // Calculate Tasks, Done, Complete %
    let totalTasks = 0;
    let doneTasks = 0;

    if (project.columns) {
        project.columns.forEach(col => {
            if (col.issues) {
                totalTasks += col.issues.length;
                if (col.name.toLowerCase() === 'done') {
                    doneTasks += col.issues.length;
                }
            }
        });
    }

    const completePercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return (
        <AppLayout>
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
                
                {/* Heading */}
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Project</h1>
                
                {/* Subheading Row */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-lg font-semibold text-slate-700">My Project</h2>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors shadow-sm"
                    >
                        Create Project
                    </button>
                </div>

                {/* Box (Project Overview Card) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-2xl">
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">{project.name}</h3>
                    
                    <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-sm font-medium mb-8">
                        {projectType}
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-100">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Tasks</p>
                            <p className="text-2xl font-bold text-slate-900">{totalTasks}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Done</p>
                            <p className="text-2xl font-bold text-green-600">{doneTasks}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Complete</p>
                            <p className="text-2xl font-bold text-brand">{completePercentage}%</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <span className="w-32 text-sm font-medium text-slate-500">Manager Name :</span>
                            <span className="text-base font-semibold text-slate-900">{project.owner?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 text-sm font-medium text-slate-500">Team Members :</span>
                            <span className="text-base font-semibold text-slate-900">{project.members ? project.members.length : 0}</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button 
                            onClick={() => navigate(`/project-workspace/${project.id}/overview`)}
                            className="px-6 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors shadow-sm flex items-center gap-2"
                        >
                            Open Project
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>

            </div>

            <CreateProjectModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSuccess={() => {
                    navigate('/projects');
                }}
            />
        </AppLayout>
    );
}
