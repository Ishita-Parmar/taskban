import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectLayout from '../Layouts/ProjectLayout';
import axios from '../lib/axios';
import { Plus, Bug, CheckCircle2, Circle, AlertCircle, X, Search } from 'lucide-react';

export default function Issues() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // New issue form state
    const [newIssue, setNewIssue] = useState({
        summary: '',
        description: '',
        type: 'bug',
        priority: 'high',
        board_column_id: ''
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projRes, issuesRes] = await Promise.all([
                axios.get(`/projects/${id}`),
                axios.get(`/projects/${id}/issues`)
            ]);
            setProject(projRes.data);
            
            // Only show bugs in the Issues page (what testers write)
            const onlyBugs = issuesRes.data.filter(issue => issue.type === 'bug');
            setIssues(onlyBugs);
            
            // Set default column for new issues to the first column
            if (projRes.data.columns && projRes.data.columns.length > 0) {
                setNewIssue(prev => ({ ...prev, board_column_id: projRes.data.columns[0].id }));
            }
        } catch (error) {
            console.error('Failed to fetch issues data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReportIssue = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/projects/${id}/issues`, newIssue);
            setShowModal(false);
            setNewIssue({ ...newIssue, summary: '', description: '' }); // reset text fields
            fetchData(); // Refresh the list
        } catch (error) {
            console.error('Failed to report issue', error);
        }
    };

    return (
        <ProjectLayout>
            <div className="flex flex-col h-full bg-slate-50 relative">
                <div className="p-8 pb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Issues tracker</h1>
                        <p className="text-sm text-slate-500 mt-1">Report and track bugs or feedback during testing.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand/90 transition-colors shadow-sm"
                    >
                        <AlertCircle size={16} /> Report Issue
                    </button>
                </div>

                <div className="flex-1 overflow-auto px-8 pb-8">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="p-12 text-center text-slate-500">Loading issues...</div>
                        ) : issues.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">No issues reported yet</h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                    Everything looks good! Testers can click "Report Issue" to log bugs when they find them.
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {issues.map((issue) => (
                                    <li key={issue.id} className="p-5 hover:bg-slate-50 transition-colors group flex items-start gap-4">
                                        <div className="mt-1">
                                            {issue.type === 'bug' ? (
                                                <Bug size={18} className="text-red-500" />
                                            ) : (
                                                <Circle size={18} className="text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-semibold text-slate-500">{issue.issue_key}</span>
                                                        <h3 className={`text-sm font-semibold text-slate-900 ${issue.column?.name === 'Done' ? 'line-through text-slate-400' : ''}`}>
                                                            {issue.summary}
                                                        </h3>
                                                    </div>
                                                    {issue.description && (
                                                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{issue.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex-shrink-0 flex items-center gap-2">
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md
                                                        ${issue.priority === 'high' || issue.priority === 'highest' ? 'bg-red-50 text-red-600' : 
                                                          issue.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}
                                                    `}>
                                                        {issue.priority}
                                                    </span>
                                                    <span className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold px-2 py-1 rounded-md">
                                                        {issue.column?.name || 'Backlog'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                                {issue.reporter && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-medium text-slate-700">Reporter:</span> {issue.reporter.name}
                                                    </div>
                                                )}
                                                {issue.assignee && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-medium text-slate-700">Assignee:</span> {issue.assignee.name}
                                                    </div>
                                                )}
                                                <div className="text-slate-400">
                                                    Reported {new Date(issue.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Report Issue Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <AlertCircle size={18} className="text-brand" /> Report an Issue
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="p-6 overflow-y-auto">
                                <form id="issueForm" onSubmit={handleReportIssue} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">What's the issue? *</label>
                                        <input
                                            required
                                            autoFocus
                                            type="text"
                                            value={newIssue.summary}
                                            onChange={(e) => setNewIssue({...newIssue, summary: e.target.value})}
                                            placeholder="e.g., Login button doesn't work on mobile"
                                            className="w-full text-sm bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">More details (optional)</label>
                                        <textarea
                                            rows="4"
                                            value={newIssue.description}
                                            onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                                            placeholder="Steps to reproduce, what you expected to happen, etc."
                                            className="w-full text-sm bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand resize-none"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Severity / Priority</label>
                                            <select
                                                value={newIssue.priority}
                                                onChange={(e) => setNewIssue({...newIssue, priority: e.target.value})}
                                                className="w-full text-sm bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand"
                                            >
                                                <option value="highest">Critical</option>
                                                <option value="high">High</option>
                                                <option value="medium">Medium</option>
                                                <option value="low">Low</option>
                                                <option value="lowest">Lowest</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    form="issueForm"
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90 transition-colors shadow-sm"
                                >
                                    Submit Issue
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProjectLayout>
    );
}
