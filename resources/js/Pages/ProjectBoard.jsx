import React, { useState, useEffect } from 'react';
import ProjectLayout from '../Layouts/ProjectLayout';
import { useParams } from 'react-router-dom';
import axios from '../lib/axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useAuthStore } from '../Stores/useAuthStore';

export default function ProjectBoard() {
    const { id } = useParams();
    const { user } = useAuthStore();
    const [project, setProject] = useState(null);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskSummary, setNewTaskSummary] = useState('');

    const fetchProject = async () => {
        try {
            const res = await axios.get(`/projects/${id}`);
            setProject(res.data);
            
            // Sort columns by position (including Done)
            const sortedColumns = (res.data.columns || []).sort((a, b) => a.position - b.position);
            
            // Ensure issues array exists and is sorted
            sortedColumns.forEach(col => {
                if (!col.issues) col.issues = [];
                col.issues.sort((a, b) => a.position - b.position);
            });
            
            setColumns(sortedColumns);
        } catch (error) {
            console.error('Failed to load project details', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        // Optimistic UI update
        const newColumns = Array.from(columns);
        const sourceColIndex = newColumns.findIndex(col => col.id.toString() === source.droppableId);
        const destColIndex = newColumns.findIndex(col => col.id.toString() === destination.droppableId);

        const sourceCol = newColumns[sourceColIndex];
        const destCol = newColumns[destColIndex];

        const sourceIssues = Array.from(sourceCol.issues);
        const destIssues = source.droppableId === destination.droppableId ? sourceIssues : Array.from(destCol.issues);

        const [movedIssue] = sourceIssues.splice(source.index, 1);
        
        // If moving to In Progress and user is assigned, set assignee
        if (destCol.name.toLowerCase().includes('progress') && !movedIssue.assignee_id) {
            movedIssue.assignee_id = user.id;
            movedIssue.assignee = user;
        }

        destIssues.splice(destination.index, 0, movedIssue);

        newColumns[sourceColIndex] = { ...sourceCol, issues: sourceIssues };
        if (source.droppableId !== destination.droppableId) {
            newColumns[destColIndex] = { ...destCol, issues: destIssues };
        }

        setColumns(newColumns);

        // Calculate new position
        let newPosition = 0;
        if (destIssues.length === 1) {
            newPosition = 65535;
        } else if (destination.index === 0) {
            newPosition = destIssues[1].position / 2;
        } else if (destination.index === destIssues.length - 1) {
            newPosition = destIssues[destination.index - 1].position + 65535;
        } else {
            newPosition = (destIssues[destination.index - 1].position + destIssues[destination.index + 1].position) / 2;
        }

        // Update Backend
        try {
            await axios.put(`/projects/${project.id}/issues/${movedIssue.id}`, {
                board_column_id: destCol.id,
                position: newPosition,
                assignee_id: movedIssue.assignee_id
            });
        } catch (error) {
            console.error("Failed to move issue", error);
            // Revert on failure (simplified)
            fetchProject();
        }
    };

    // State for tracking which column is currently showing the Add Task input
    const [addingTaskInColumn, setAddingTaskInColumn] = useState(null);

    const handleCreateTask = async (e, columnId) => {
        e.preventDefault();
        if (!newTaskSummary.trim()) {
            setAddingTaskInColumn(null);
            return;
        }

        try {
            await axios.post(`/projects/${project.id}/issues`, {
                board_column_id: columnId,
                summary: newTaskSummary,
                type: 'task',
                priority: 'medium'
            });
            setNewTaskSummary('');
            setAddingTaskInColumn(null);
            fetchProject();
        } catch (error) {
            console.error("Failed to create task", error);
            alert("Error: " + (error.response?.data?.message || error.message));
        }
    };

    if (loading) {
        return (
            <ProjectLayout>
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                </div>
            </ProjectLayout>
        );
    }

    if (!project) return null;

    return (
        <ProjectLayout>
            <div className="flex flex-col h-full bg-slate-50/50">
                <header className="px-8 py-6 border-b border-slate-200 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-slate-200 text-slate-700 font-bold text-sm rounded-lg tracking-wider">
                            {project.key}
                        </span>
                        <h1 className="text-2xl font-bold text-slate-900">Board</h1>
                    </div>
                </header>

                <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex gap-6 h-full items-start">
                            {columns.map(column => (
                                <div key={column.id} className="w-80 shrink-0 flex flex-col max-h-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="px-4 py-3 flex items-center justify-between bg-slate-100/80 backdrop-blur-sm border-b border-slate-200 shrink-0">
                                        <h3 className="font-bold text-slate-700 text-sm">{column.name}</h3>
                                        <span className="bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                            {column.issues.length}
                                        </span>
                                    </div>

                                    <Droppable droppableId={column.id.toString()}>
                                        {(provided, snapshot) => (
                                            <div 
                                                {...provided.droppableProps} 
                                                ref={provided.innerRef}
                                                className={`flex-1 p-3 overflow-y-auto space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-slate-200/50' : ''}`}
                                            >
                                                {column.issues.map((issue, index) => (
                                                    <Draggable key={issue.id} draggableId={issue.id.toString()} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm group ${snapshot.isDragging ? 'shadow-lg ring-2 ring-brand ring-opacity-50' : 'hover:shadow-md hover:border-slate-300'}`}
                                                            >
                                                                <div className="flex items-start justify-between gap-2 mb-3">
                                                                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                                                                        {issue.summary}
                                                                    </p>
                                                                </div>
                                                                
                                                                <div className="flex items-center justify-between mt-auto pt-2">
                                                                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-brand transition-colors">
                                                                        {issue.issue_key}
                                                                    </span>
                                                                    
                                                                    {/* Assignee Avatar/Name */}
                                                                    {issue.assignee && (
                                                                        <div className="flex items-center gap-1.5" title={`Assigned to ${issue.assignee.name}`}>
                                                                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                                                {issue.assignee.name}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}

                                                {/* Add Task Input */}
                                                <div className="pt-2">
                                                    {addingTaskInColumn === column.id ? (
                                                        <form onSubmit={(e) => handleCreateTask(e, column.id)} className="bg-white p-3 rounded-xl border border-brand shadow-sm">
                                                            <textarea
                                                                autoFocus
                                                                className="w-full text-sm border-none focus:ring-0 p-0 resize-none h-16 text-slate-900"
                                                                placeholder="What needs to be done?"
                                                                value={newTaskSummary}
                                                                onChange={(e) => setNewTaskSummary(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                        e.preventDefault();
                                                                        handleCreateTask(e, column.id);
                                                                    }
                                                                }}
                                                            />
                                                            <div className="flex justify-end gap-2 mt-2">
                                                                <button type="button" onClick={() => setAddingTaskInColumn(null)} className="px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded">Cancel</button>
                                                                <button type="submit" className="px-3 py-1 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover shadow-sm">Add</button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <button 
                                                            onClick={() => setAddingTaskInColumn(column.id)}
                                                            className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 rounded-xl transition-colors"
                                                        >
                                                            <Plus size={16} /> Create Task
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </div>
            </div>
        </ProjectLayout>
    );
}
