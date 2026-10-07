import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectLayout from '../Layouts/ProjectLayout';
import axios from '../lib/axios';
import { Users, Mail, Briefcase, CheckCircle2, CircleDashed, Calendar } from 'lucide-react';

export default function Team() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projRes, membersRes, issuesRes] = await Promise.all([
                axios.get(`/projects/${id}`),
                axios.get(`/projects/${id}/members`),
                axios.get(`/projects/${id}/issues`)
            ]);
            
            const fetchedProject = projRes.data;
            let fetchedMembers = membersRes.data || [];
            
            // Check if owner is in the members list
            const hasOwner = fetchedMembers.some(m => m.id === fetchedProject.owner_id);
            if (!hasOwner && fetchedProject.owner) {
                // Add owner to the top of the list if missing
                fetchedMembers.unshift({
                    ...fetchedProject.owner,
                    pivot: { role: 'owner', created_at: fetchedProject.created_at }
                });
            }
            
            setProject(fetchedProject);
            setMembers(fetchedMembers);
            setIssues(issuesRes.data || []);
        } catch (error) {
            console.error('Failed to fetch team data', error);
        } finally {
            setLoading(false);
        }
    };

    const getMemberStats = (memberId) => {
        const assignedTasks = issues.filter(issue => issue.assignee_id === memberId);
        const completedTasks = assignedTasks.filter(issue => issue.column?.name === 'Done');
        const pendingTasks = assignedTasks.length - completedTasks.length;
        
        return {
            assigned: assignedTasks.length,
            completed: completedTasks.length,
            workload: pendingTasks
        };
    };

    return (
        <ProjectLayout>
            <div className="flex flex-col h-full bg-slate-50">
                <div className="p-8 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Users size={24} className="text-brand" />
                        Team Members
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">View all team members and their current workload.</p>
                </div>

                <div className="flex-1 overflow-auto px-8 pb-8">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="p-12 text-center text-slate-500">Loading team data...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Assigned Tasks</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Completed Tasks</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Current Workload</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Join Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {members.map((member) => {
                                            const stats = getMemberStats(member.id);
                                            const joinDate = member.pivot?.created_at ? new Date(member.pivot.created_at).toLocaleDateString() : 'N/A';
                                            
                                            return (
                                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm">
                                                                {member.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="font-semibold text-slate-900">{member.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                            ${member.pivot?.role === 'owner' ? 'bg-purple-100 text-purple-800' : 
                                                              member.pivot?.role === 'admin' ? 'bg-blue-100 text-blue-800' : 
                                                              'bg-slate-100 text-slate-800'}`}>
                                                            {member.pivot?.role || 'Member'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={14} className="text-slate-400" />
                                                            {member.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">
                                                            {stats.assigned}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                                            {stats.completed}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold
                                                            ${stats.workload > 5 ? 'bg-red-50 text-red-700' : 
                                                              stats.workload > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600'}`}>
                                                            <Briefcase size={16} className={stats.workload > 5 ? 'text-red-500' : stats.workload > 0 ? 'text-amber-500' : 'text-slate-400'} />
                                                            {stats.workload} {stats.workload === 1 ? 'Task' : 'Tasks'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm text-slate-500">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Calendar size={14} className="text-slate-400" />
                                                            {joinDate}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {members.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                                    No team members found for this project.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProjectLayout>
    );
}
