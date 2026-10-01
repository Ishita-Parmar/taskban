import React, { useState, useEffect } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from '../lib/axios';
import { MoreHorizontal } from 'lucide-react';

export default function Dashboard() {
    const [project, setProject] = useState(null);
    const [columns, setColumns] = useState([]);
    const [issues, setIssues] = useState({});
    const [loading, setLoading] = useState(true);

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
                    
                    // Sort each column by position
                    Object.keys(grouped).forEach(key => {
                        grouped[key].sort((a, b) => a.position - b.position);
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

    if (!project) {
        return (
            <AppLayout>
                <div className="flex-1 flex items-center justify-center flex-col">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">No Projects Found</h2>
                    <p className="text-slate-500 mb-6">Create a project to get started with your Kanban board.</p>
                    <button className="bg-brand hover:bg-brand-hover text-white px-6 py-2.5 rounded-full font-medium shadow-sm transition-colors">
                        Create Project
                    </button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <header className="h-16 border-b border-slate-border flex items-center justify-between px-8 bg-white shrink-0">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{project.name}</h1>
                </div>
                <button className="bg-brand hover:bg-brand-hover text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm">
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
                                            {issues[column.id]?.map((issue, index) => (
                                                <Draggable key={issue.id} draggableId={issue.id.toString()} index={index}>
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
                                                                    <span className="text-xs font-medium text-slate-500 hover:text-brand transition-colors">{issue.issue_key}</span>
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
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </AppLayout>
    );
}
