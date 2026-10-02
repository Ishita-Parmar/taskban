import React, { useState } from 'react';
import axios from '../lib/axios';

export default function IssueDetailsCard({ issue, colName, columns, project, onUpdate }) {
    const [commentText, setCommentText] = useState('');
    const [commentFile, setCommentFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        summary: issue.summary,
        description: issue.description || '',
        assignee_id: issue.assignee?.id || '',
        assignee_name: issue.assignee?.name || '',
        priority: issue.priority || 'medium',
        deadline: issue.deadline ? issue.deadline.split('T')[0] : ''
    });
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() && !commentFile) return;
        
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('body', commentText);
        if (commentFile) {
            formData.append('attachment', commentFile);
        }
        
        try {
            const res = await axios.post(`/issues/${issue.id}/comments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Trigger an update in the parent to refresh the issue
            onUpdate(issue.id, res.data, 'comment');
            
            setCommentText('');
            setCommentFile(null);
        } catch (error) {
            console.error('Failed to add comment', error);
            alert('Failed to add comment or upload file.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await axios.put(`/projects/${project.id}/issues/${issue.id}`, editForm);
            onUpdate(issue.id, res.data, 'issue');
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update task', error);
            alert('Failed to update task.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="border border-slate-200 rounded-2xl p-6 hover:border-brand/30 transition-colors bg-white shadow-sm mb-6">
            {/* Top Section: Manager Assignment */}
            <div className="border-b border-slate-100 pb-5 mb-5 flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="bg-brand/10 text-brand p-1.5 rounded-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </span>
                        Project Manager ({issue.reporter?.name || 'Manager'})
                    </h4>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Edit Task
                    </button>
                )}
            </div>
            
            {!isEditing ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-slate-50 p-4 rounded-xl mb-5">
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Task</span>
                            <span className="font-medium text-slate-700">{issue.summary}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Assigned To</span>
                            <span className="font-medium text-slate-700">{issue.assignee?.name || 'Unassigned'}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Priority</span>
                            <span className={`font-medium capitalize ${issue.priority === 'high' ? 'text-rose-600' : issue.priority === 'low' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {issue.priority}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Deadline</span>
                            <span className="font-medium text-slate-700">{issue.deadline ? new Date(issue.deadline).toLocaleDateString() : 'No deadline'}</span>
                        </div>
                    </div>

                    {/* Bottom Section: Team Member Work Flow */}
            <div className="mb-6">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </span>
                    Team Member Work Flow
                </h4>
                <div className="bg-white border border-slate-100 p-4 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Task Name</span>
                            <span className="font-medium text-slate-700">{issue.summary}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Description</span>
                            <span className="font-medium text-slate-700">{issue.description || 'No description provided.'}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Assigned To</span>
                            <span className="font-medium text-slate-700">{issue.assignee?.name || 'Unassigned'}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Created By</span>
                            <span className="font-medium text-slate-700">{issue.reporter?.name || 'Manager'}</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm border-t border-slate-100 pt-4">
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Priority</span>
                            <span className={`font-medium capitalize ${issue.priority === 'high' ? 'text-rose-600' : issue.priority === 'low' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {issue.priority}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Status</span>
                            <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-700 uppercase tracking-wider">
                                {colName}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Deadline</span>
                            <span className="font-medium text-slate-700">{issue.deadline ? new Date(issue.deadline).toLocaleDateString() : 'No deadline'}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Progress</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex-1">
                                    <div 
                                        className="h-full bg-brand" 
                                        style={{ 
                                            width: colName.toLowerCase().includes('done') ? '100%' : 
                                                   colName.toLowerCase().includes('progress') ? '50%' : '0%' 
                                        }}
                                    ></div>
                                </div>
                                <span className="text-xs font-bold text-slate-500">
                                    {colName.toLowerCase().includes('done') ? '100%' : 
                                     colName.toLowerCase().includes('progress') ? '50%' : '0%'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs text-slate-400 font-semibold mb-1 uppercase">Created At</span>
                            <span className="font-medium text-slate-500 text-xs">{new Date(issue.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
            </>
            ) : (
                <form onSubmit={handleEditSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 shadow-inner">
                    <h4 className="text-md font-bold text-slate-900 mb-4">Edit Task Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Task Summary</label>
                            <input 
                                type="text" 
                                required
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand"
                                value={editForm.summary}
                                onChange={e => setEditForm({...editForm, summary: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned To (Change Member)</label>
                            <input 
                                type="text"
                                list={`assignees-${issue.id}`}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand bg-white"
                                value={editForm.assignee_name !== undefined ? editForm.assignee_name : (issue.assignee?.name || '')}
                                onChange={e => setEditForm({...editForm, assignee_name: e.target.value, assignee_id: ''})}
                                placeholder="Type a name or select"
                            />
                            <datalist id={`assignees-${issue.id}`}>
                                {project?.members?.map(member => (
                                    <option key={member.id} value={member.name} />
                                ))}
                            </datalist>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                            <textarea 
                                rows="2"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand"
                                value={editForm.description}
                                onChange={e => setEditForm({...editForm, description: e.target.value})}
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                            <select 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand bg-white"
                                value={editForm.priority}
                                onChange={e => setEditForm({...editForm, priority: e.target.value})}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline</label>
                            <input 
                                type="date" 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand"
                                value={editForm.deadline}
                                onChange={e => setEditForm({...editForm, deadline: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                        <button 
                            type="button" 
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-4 py-1.5 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg shadow-sm transition-colors"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}

            {/* Comments & Attachments Section */}
            <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </span>
                    Comments & Updates
                </h4>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4 max-h-[300px] overflow-y-auto space-y-4">
                    {(!issue.comments || issue.comments.length === 0) ? (
                        <p className="text-slate-400 text-sm text-center py-4">No comments yet.</p>
                    ) : (
                        issue.comments.map(comment => (
                            <div key={comment.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold">
                                            {comment.user?.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-sm text-slate-900">{comment.user?.name}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.body}</p>
                                {comment.attachment && (
                                    <div className="mt-3">
                                        <a href={`/storage/${comment.attachment}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                            View Attachment
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleCommentSubmit} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 shadow-sm focus-within:border-brand transition-colors">
                    <textarea
                        rows="2"
                        className="w-full text-sm resize-none focus:outline-none p-2 placeholder-slate-400"
                        placeholder="Add a comment or update..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    ></textarea>
                    <div className="flex justify-between items-center px-2">
                        <label className="cursor-pointer text-slate-500 hover:text-brand transition-colors flex items-center gap-2 text-xs font-semibold">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                            {commentFile ? commentFile.name : 'Attach File'}
                            <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => setCommentFile(e.target.files[0])}
                            />
                        </label>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || (!commentText.trim() && !commentFile)}
                            className="px-4 py-1.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
