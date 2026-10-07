import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectLayout from '../Layouts/ProjectLayout';
import axios from '../lib/axios';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

export default function Backlog() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/projects/${id}`);
            setProject(res.data);
            
            let parsed = [];
            const text = res.data.backlog_text || '';
            try {
                parsed = JSON.parse(text);
                if (!Array.isArray(parsed)) {
                    parsed = text.split('\n').filter(line => line.trim());
                }
            } catch (e) {
                // If it's just raw text, split by newline
                parsed = text.split('\n').filter(line => line.trim());
            }
            setItems(parsed);
        } catch (error) {
            console.error('Failed to fetch project', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            // Remove empty items before saving
            const filtered = items.filter(item => item.trim());
            const textToSave = JSON.stringify(filtered);
            
            await axios.put(`/projects/${id}`, { backlog_text: textToSave });
            setIsEditing(false);
            setItems(filtered);
            
            // Re-fetch to ensure sync with server
            fetchProject();
        } catch (error) {
            console.error('Failed to update backlog', error);
        }
    };

    const handleCancel = () => {
        const text = project?.backlog_text || '';
        let parsed = [];
        try {
            parsed = JSON.parse(text);
            if (!Array.isArray(parsed)) {
                parsed = text.split('\n').filter(line => line.trim());
            }
        } catch (e) {
            parsed = text.split('\n').filter(line => line.trim());
        }
        setItems(parsed);
        setIsEditing(false);
    };

    const addItem = () => {
        setItems([...items, '']);
        setIsEditing(true); // Switch to edit mode so they can type immediately
    };

    const updateItem = (index, value) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };
    
    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    return (
        <ProjectLayout>
            <div className="flex flex-col h-full bg-slate-50">
                <div className="p-8 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Backlog</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your pending work and tasks manually.</p>
                </div>

                <div className="flex-1 overflow-auto px-8 pb-8">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
                        {loading ? (
                            <div className="text-center text-slate-500 py-8">Loading...</div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-slate-800">Pending Work List</h2>
                                    
                                    {!isEditing ? (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={addItem}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-brand/10 text-brand text-sm font-medium rounded-lg hover:bg-brand/20 transition-colors"
                                            >
                                                <Plus size={16} /> Add Work
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:text-brand transition-colors"
                                            >
                                                <Edit2 size={16} /> Edit Backlog
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={addItem}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-brand/10 text-brand text-sm font-medium rounded-lg hover:bg-brand/20 transition-colors"
                                            >
                                                <Plus size={16} /> Add 
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand/90 transition-colors"
                                            >
                                                <Save size={16} /> Save
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                            >
                                                <X size={16} /> Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-3">
                                    {items.length === 0 && !isEditing ? (
                                        <div className="p-8 bg-slate-50 rounded-xl text-center border border-slate-100">
                                            <span className="text-slate-400 italic">No backlog items written yet. Click '+ Add Work' to start building your list.</span>
                                        </div>
                                    ) : (
                                        items.map((item, index) => (
                                            isEditing ? (
                                                <div key={index} className="flex items-center gap-3">
                                                    <div className="flex-1 relative">
                                                        <input
                                                            type="text"
                                                            value={item}
                                                            onChange={(e) => updateItem(index, e.target.value)}
                                                            className="w-full pl-4 pr-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand shadow-sm"
                                                            placeholder="Describe the pending work..."
                                                            autoFocus={index === items.length - 1 && item === ''}
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={() => removeItem(index)}
                                                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                                        title="Remove item"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div key={index} className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                                                    <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0"></div>
                                                    <div className="flex-1 font-medium">{item}</div>
                                                </div>
                                            )
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProjectLayout>
    );
}
