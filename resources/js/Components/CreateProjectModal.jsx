import React, { useState } from 'react';
import axios from '../lib/axios';

export default function CreateProjectModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        key: '',
        description: '',
        start_date: '',
        deadline: '',
        team_members: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axios.post('/projects', formData);
            setFormData({ name: '', key: '', description: '', start_date: '', deadline: '', team_members: '' });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Create New Project</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Project Name</label>
                        <input 
                            type="text" name="name" required value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all text-sm"
                            placeholder="e.g. E-Commerce Website"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Project Key</label>
                        <input 
                            type="text" name="key" required value={formData.key} onChange={handleChange} maxLength="10"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all text-sm uppercase"
                            placeholder="e.g. ECW"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <textarea 
                            name="description" value={formData.description} onChange={handleChange} rows="2"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all text-sm"
                            placeholder="Short description of the project..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date</label>
                            <input 
                                type="date" name="start_date" value={formData.start_date} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
                            <input 
                                type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Team Members</label>
                        <input 
                            type="text" name="team_members" value={formData.team_members} onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all text-sm"
                            placeholder="Comma separated emails (e.g. dev1@test.com, dev2@test.com)"
                        />
                        <p className="text-xs text-slate-500 mt-1">Users will be created automatically if they don't exist.</p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-hover shadow-sm transition-all flex items-center gap-2">
                            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
