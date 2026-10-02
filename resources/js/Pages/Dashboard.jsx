import React, { useState, useEffect } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from '../lib/axios';
import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IssueDetailsCard from '../Components/IssueDetailsCard';

export default function Dashboard() {
    const [project, setProject] = useState(null);
    const [columns, setColumns] = useState([]);
    const [issues, setIssues] = useState({});
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', key: '', description: '', team_members: '' });
    const [selectedMemberForTask, setSelectedMemberForTask] = useState(null);
    const [selectedMemberForDetails, setSelectedMemberForDetails] = useState(null);
    const [newTask, setNewTask] = useState({ summary: '', deadline: '', priority: 'medium' });
    const navigate = useNavigate();

    useEffect(() => {
        const loadBoard = async () => {
            try {
                // Fetch projects
                const projRes = await axios.get('/projects');
                if (projRes.data.length > 0) {
                    const firstProjId = projRes.data[0].id;
                    const projDetailRes = await axios.get(`/projects/${firstProjId}`);
                    const issueRes = await axios.get(`/projects/${firstProjId}/issues`);
                    
                    setProject(projDetailRes.data);
                    setColumns(projDetailRes.data.columns);
                    
                    // Group issues by column
                    const grouped = {};
                    projDetailRes.data.columns.forEach(col => {
                        grouped[col.id] = [];
                    });
                    
                    issueRes.data.forEach(issue => {
                        if (grouped[issue.board_column_id]) {
                            grouped[issue.board_column_id].push(issue);
                        }
                    });
                    
                    // Sort each column by assignee name, then position
                    Object.keys(grouped).forEach(key => {
                        grouped[key].sort((a, b) => {
                            const nameA = (a.assignee?.name || 'Unassigned').toLowerCase();
                            const nameB = (b.assignee?.name || 'Unassigned').toLowerCase();
                            if (nameA < nameB) return -1;
                            if (nameA > nameB) return 1;
                            return a.position - b.position;
                        });
                    });
                    
                    setIssues(grouped);
                }
            } catch (error) {
                console.error('Failed to load board', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadBoard();
    }, []);

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceColId = parseInt(source.droppableId);
        const destColId = parseInt(destination.droppableId);
        
        const sourceCol = Array.from(issues[sourceColId]);
        const destCol = sourceColId === destColId ? sourceCol : Array.from(issues[destColId]);
        
        const [movedIssue] = sourceCol.splice(source.index, 1);
        
        // Calculate new position
        let newPosition = 1000;
        if (destCol.length > 0) {
            if (destination.index === 0) {
                newPosition = destCol[0].position / 2;
            } else if (destination.index === destCol.length) {
                newPosition = destCol[destCol.length - 1].position + 1000;
            } else {
                const prevItem = destCol[destination.index - 1];
                const nextItem = destCol[destination.index];
                newPosition = (prevItem.position + nextItem.position) / 2;
            }
        }
        
        movedIssue.position = newPosition;
        movedIssue.board_column_id = destColId;
        
        destCol.splice(destination.index, 0, movedIssue);
        
        // Re-sort destCol to maintain assignee grouping
        destCol.sort((a, b) => {
            const nameA = (a.assignee?.name || 'Unassigned').toLowerCase();
            const nameB = (b.assignee?.name || 'Unassigned').toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return a.position - b.position;
        });
        
        setIssues({
            ...issues,
            [sourceColId]: sourceCol,
            [destColId]: destCol,
        });
        
        // Update backend
        try {
            await axios.put(`/projects/${project.id}/issues/${movedIssue.id}/move`, {
                board_column_id: destColId,
                position: newPosition
            });
        } catch (error) {
            console.error('Failed to move issue', error);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AppLayout>
        );
    }

    const handleMemberClick = (member) => {
        const memberIssues = Object.values(issues).flat().filter(issue => issue.assignee?.id === member.id);
        if (memberIssues.length > 0) {
            setSelectedMemberForDetails({ member, issues: memberIssues });
        } else {
            setSelectedMemberForTask(member);
        }
    };

    const handleIssueUpdate = (issueId, payload, type = 'comment') => {
        const updateFn = (issue) => {
            if (issue.id === issueId) {
                if (type === 'comment') {
                    return { ...issue, comments: [...(issue.comments || []), payload] };
                } else if (type === 'issue') {
                    // payload is the updated issue object
                    return { ...issue, ...payload };
                }
            }
            return issue;
        };

        if (selectedMemberForDetails) {
            setSelectedMemberForDetails({ 
                ...selectedMemberForDetails, 
                issues: selectedMemberForDetails.issues.map(updateFn) 
            });
        }
        
        const updatedIssuesObj = { ...issues };
        for (const colId in updatedIssuesObj) {
            updatedIssuesObj[colId] = updatedIssuesObj[colId].map(updateFn);
        }
        setIssues(updatedIssuesObj);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/projects', newProject);
            window.location.reload(); // Reload to fetch projects
        } catch (error) {
            alert("Failed to create project. The Key might already be taken.");
        }
    };

    if (!project) {
        return (
            <AppLayout>
                <div className="flex-1 flex items-center justify-center flex-col relative h-full">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">No Projects Found</h2>
                    <p className="text-slate-500 mb-6">Create a project to get started with your Kanban board.</p>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-brand hover:bg-brand-hover text-white px-6 py-2.5 rounded-full font-medium shadow-sm transition-colors"
                    >
                        Create Project
                    </button>
                    
                    {showCreateModal && (
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Create New Project</h3>
                                <form onSubmit={handleCreateSubmit} className="space-y-5 text-left w-full">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Project Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="e.g. Website Redesign"
                                            className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-surface transition-colors"
                                            value={newProject.name}
                                            onChange={e => setNewProject({...newProject, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Project Key (Short Code)</label>
                                        <input 
                                            type="text" 
                                            required
                                            maxLength={10}
                                            placeholder="e.g. TASK"
                                            className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand uppercase bg-white hover:bg-surface transition-colors"
                                            value={newProject.key}
                                            onChange={e => setNewProject({...newProject, key: e.target.value.toUpperCase()})}
                                        />
                                        <p className="text-xs text-slate-500 mt-1.5">Used as a prefix for tasks (e.g., TASK-1).</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Description (Optional)</label>
                                        <textarea 
                                            rows="3"
                                            placeholder="What is this project about?"
                                            className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-surface transition-colors resize-none"
                                            value={newProject.description}
                                            onChange={e => setNewProject({...newProject, description: e.target.value})}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Team Members (Emails)</label>
                                        <input 
                                            type="text" 
                                            placeholder="comma separated emails, e.g. john@example.com, jane@example.com"
                                            className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-surface transition-colors"
                                            value={newProject.team_members}
                                            onChange={e => setNewProject({...newProject, team_members: e.target.value})}
                                        />
                                        <p className="text-xs text-slate-500 mt-1.5">Invitations will be logged.</p>
                                    </div>
                                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowCreateModal(false)}
                                            className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-colors shadow-sm"
                                        >
                                            Create Project
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        );
    }

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            // Find To Do column ID
            const todoColumn = columns.find(c => c.position === 1000) || columns[0];
            
            const payload = {
                board_column_id: todoColumn.id,
                type: 'task',
                summary: newTask.summary,
                priority: newTask.priority,
                deadline: newTask.deadline,
            };
            
            if (selectedMemberForTask.id === '') {
                payload.assignee_name = newTask.assignee_name;
            } else {
                payload.assignee_id = selectedMemberForTask.id;
            }
            
            const res = await axios.post(`/projects/${project.id}/issues`, payload);
            
            // Update issues state
            const newIssues = { ...issues };
            if (!newIssues[todoColumn.id]) newIssues[todoColumn.id] = [];
            newIssues[todoColumn.id].push(res.data);
            setIssues(newIssues);
            
            const newlyAssignedMember = selectedMemberForTask;
            setSelectedMemberForTask(null);
            setNewTask({ summary: '', deadline: '', priority: 'medium', assignee_name: '' });
            
            // Immediately open details modal if we assigned to a specific existing member
            if (selectedMemberForTask.id !== '') {
                const memberIssues = Object.values(newIssues).flat().filter(issue => issue.assignee?.id === newlyAssignedMember.id);
                setSelectedMemberForDetails({ member: newlyAssignedMember, issues: memberIssues });
            }
        } catch (error) {
            console.error('Failed to create task', error);
            alert('Failed to create task');
        }
    };

    return (
        <AppLayout>
            <header className="h-16 border-b border-slate-border flex items-center justify-between px-8 bg-white shrink-0">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{project.name}</h1>
                    <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                        <span className="text-sm font-medium text-slate-500">Team:</span>
                        <div className="flex flex-wrap gap-2">
                            {project.members && project.members
                                .filter(member => Object.values(issues).flat().some(issue => issue.assignee?.id === member.id))
                                .map(member => (
                                <button 
                                    key={member.id}
                                    onClick={() => handleMemberClick(member)}
                                    className="px-3 py-1 bg-slate-100 hover:bg-brand/10 hover:text-brand hover:border-brand/30 border border-transparent rounded-full text-xs font-semibold text-slate-700 transition-colors"
                                    title="View tasks"
                                >
                                    {member.name}
                                </button>
                            ))}
                            {(!project.members || project.members.filter(member => Object.values(issues).flat().some(issue => issue.assignee?.id === member.id)).length === 0) && (
                                <span className="text-xs text-slate-400 italic">No active members</span>
                            )}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        setSelectedMemberForTask({ id: '', name: 'Anyone' });
                        setNewTask({ summary: '', deadline: '', priority: 'medium', assignee_name: '' });
                    }}
                    className="bg-brand hover:bg-brand-hover text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm"
                >
                    Create Issue
                </button>
            </header>

            <div className="px-8 py-4 flex gap-4 items-center bg-white shrink-0">
                <input 
                    type="text" 
                    placeholder="Search this board" 
                    className="border border-slate-border rounded-full px-4 py-2 text-sm w-72 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand hover:bg-surface transition-colors"
                />
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 bg-white flex">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 h-full items-start">
                        {columns.map(column => (
                            <div key={column.id} className="w-[320px] min-w-[320px] bg-surface rounded-2xl flex flex-col max-h-full border border-slate-border/50">
                                <div className="p-4 pb-3 sticky top-0 bg-surface z-10 flex justify-between items-center rounded-t-2xl">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {column.name} <span className="text-slate-900 ml-2">{issues[column.id]?.length || 0}</span>
                                    </h3>
                                    <button className="text-slate-400 hover:text-slate-900 transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                                
                                <Droppable droppableId={column.id.toString()}>
                                    {(provided, snapshot) => (
                                        <div 
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 overflow-y-auto px-3 pb-3 space-y-3 min-h-[150px] ${snapshot.isDraggingOver ? 'bg-surface-hover/50' : ''}`}
                                        >
                                            {issues[column.id]?.map((issue, index) => {
                                                const prevIssue = index > 0 ? issues[column.id][index - 1] : null;
                                                const currentAssignee = issue.assignee?.name || 'Unassigned';
                                                const prevAssignee = prevIssue?.assignee?.name || 'Unassigned';
                                                const showHeader = currentAssignee !== prevAssignee;

                                                return (
                                                    <React.Fragment key={issue.id}>
                                                        {showHeader && (
                                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-2 ml-1 flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[9px] font-bold">
                                                                    {currentAssignee !== 'Unassigned' ? currentAssignee.substring(0, 2).toUpperCase() : '?'}
                                                                </div>
                                                                {currentAssignee}
                                                            </div>
                                                        )}
                                                        <Draggable draggableId={issue.id.toString()} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={`bg-white p-4 rounded-xl border cursor-grab active:cursor-grabbing hover:bg-surface-hover transition-colors group ${
                                                                        snapshot.isDragging ? 'shadow-lg border-brand/50 ring-1 ring-brand/50 scale-105 z-50' : 'shadow-sm border-slate-border hover:shadow'
                                                                    }`}
                                                                    style={{
                                                                        ...provided.draggableProps.style,
                                                                    }}
                                                                >
                                                                    <p className="text-sm text-slate-900 font-medium mb-4 leading-relaxed">{issue.summary}</p>
                                                                    <div className="flex items-center justify-between mt-auto">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className={`w-4 h-4 rounded flex items-center justify-center ${
                                                                                issue.type === 'bug' ? 'bg-status-danger' : 'bg-status-info'
                                                                            }`}>
                                                                                {issue.type === 'bug' ? (
                                                                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                                                ) : (
                                                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                                )}
                                                                            </div>
                                                                            <span className="text-xs font-medium text-slate-500 hover:text-brand transition-colors">{project.name}</span>
                                                                        </div>
                                                                        {issue.assignee && (
                                                                            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shadow-sm" title={issue.assignee.name}>
                                                                                {issue.assignee.name.substring(0, 2).toUpperCase()}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    </React.Fragment>
                                                );
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>

            {/* Assign Task Modal */}
            {selectedMemberForTask && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Assign Task</h3>
                        <p className="text-sm text-slate-500 mb-6">Assigning a new task to <span className="font-semibold text-brand">{selectedMemberForTask.name}</span></p>
                        
                        <form onSubmit={handleCreateTask} className="space-y-5 text-left w-full">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Task Name (Summary)</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Design Login Page"
                                    className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-surface transition-colors"
                                    value={newTask.summary}
                                    onChange={e => setNewTask({...newTask, summary: e.target.value})}
                                />
                            </div>
                            
                            {selectedMemberForTask.id === '' ? (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-1.5">Assigned To (Member Name)</label>
                                    <input 
                                        type="text"
                                        required
                                        list="project-members"
                                        placeholder="Type name or select from list"
                                        className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-surface transition-colors"
                                        value={newTask.assignee_name || ''}
                                        onChange={e => setNewTask({...newTask, assignee_name: e.target.value})}
                                    />
                                    <datalist id="project-members">
                                        {project.members?.map(m => <option key={m.id} value={m.name} />)}
                                    </datalist>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-1.5">Assigned By</label>
                                    <input 
                                        type="text" 
                                        disabled
                                        className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                                        value="You (Manager)"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-1.5">Deadline</label>
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-surface transition-colors"
                                        value={newTask.deadline}
                                        onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-1.5">Priority</label>
                                    <select 
                                        className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-surface transition-colors"
                                        value={newTask.priority}
                                        onChange={e => setNewTask({...newTask, priority: e.target.value})}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                                <button 
                                    type="button" 
                                    onClick={() => setSelectedMemberForTask(null)}
                                    className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-colors shadow-sm"
                                >
                                    Assign Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Member Details Modal */}
            {selectedMemberForDetails && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 transform transition-all scale-100 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Tasks for {selectedMemberForDetails.member.name}</h3>
                                <p className="text-sm text-slate-500">History of assigned tasks and their progress.</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => {
                                        setSelectedMemberForTask(selectedMemberForDetails.member);
                                        setSelectedMemberForDetails(null);
                                    }}
                                    className="px-5 py-2 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
                                >
                                    Assign New Task
                                </button>
                                <button 
                                    onClick={() => navigate(`/member/${selectedMemberForDetails.member.id}/dashboard`, {
                                        state: {
                                            member: selectedMemberForDetails.member,
                                            issues: selectedMemberForDetails.issues,
                                            project,
                                            columns
                                        }
                                    })}
                                    className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
                                >
                                    Dashboard
                                </button>
                                <button 
                                    onClick={() => setSelectedMemberForDetails(null)}
                                    className="p-2 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2">
                            <div className="space-y-4">
                                {selectedMemberForDetails.issues.map(issue => {
                                    const colName = columns.find(c => c.id === issue.board_column_id)?.name || 'Unknown';
                                    return (
                                        <IssueDetailsCard 
                                            key={issue.id} 
                                            issue={issue} 
                                            colName={colName} 
                                            columns={columns} 
                                            project={project}
                                            onUpdate={handleIssueUpdate} 
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
