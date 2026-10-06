import React, { useState, useEffect } from 'react';
import ProjectLayout from '../Layouts/ProjectLayout';
import { useParams } from 'react-router-dom';
import axios from '../lib/axios';
import { List, Activity, Target, CheckCircle2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAuthStore } from '../Stores/useAuthStore';

export default function ProjectWorkspaceOverview() {
    const { id } = useParams();
    const { user } = useAuthStore();
    const [project, setProject] = useState(null);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProject = async () => {
        try {
            const res = await axios.get(`/projects/${id}`);
            setProject(res.data);
            
            // Sort columns by position
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
            fetchProject(); // Revert on failure
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

    // Helper to get column object for a specific name
    const getColumn = (keyword) => {
        return columns.find(c => c.name.toLowerCase().includes(keyword.toLowerCase()));
    };

    const renderCard = (keyword, title, Icon, colorClass, bgColorClass, iconColorClass, iconBgColorClass) => {
        const column = getColumn(keyword);
        if (!column) return null; // Wait for columns to load

        return (
            <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${iconBgColorClass} ${iconColorClass} flex items-center justify-center`}>
                            <Icon size={20} />
                        </div>
                        <p className="text-lg font-bold text-slate-700">{title}</p>
                    </div>
                    <span className={`text-xs font-bold ${iconBgColorClass} ${colorClass} px-2 py-1 rounded-full`}>
                        {column.issues.length}
                    </span>
                </div>
                
                <Droppable droppableId={column.id.toString()}>
                    {(provided, snapshot) => (
                        <div 
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`flex-1 min-h-[100px] transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-slate-50' : ''}`}
                        >
                            <div className="space-y-2">
                                {column.issues.map((issue, index) => (
                                    <Draggable key={issue.id} draggableId={issue.id.toString()} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`bg-slate-50 border border-slate-100 p-3 rounded-lg flex flex-col gap-1 text-sm text-slate-700 transition-shadow ${snapshot.isDragging ? 'shadow-md ring-1 ring-brand ring-opacity-50' : 'hover:border-slate-200'}`}
                                            >
                                                <span className="font-semibold whitespace-nowrap text-slate-400 text-xs">{issue.issue_key}</span>
                                                <span className="leading-snug">{issue.summary}</span>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </div>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    };

    return (
        <ProjectLayout>
            <div className="flex flex-col h-full bg-slate-50/50">
                {/* Header */}
                <header className="px-8 py-6 border-b border-slate-200 bg-white shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-slate-200 text-slate-700 font-bold text-sm rounded-lg tracking-wider">
                                {project.key}
                            </span>
                            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-x-hidden p-8 overflow-y-auto">
                    <div className="mb-8 max-w-7xl">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h2>
                        <p className="text-slate-500 text-lg mt-1">Welcome to the project workspace.</p>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start max-w-7xl pb-8">
                            {renderCard('to do', 'To-Do', List, 'text-slate-500', 'bg-slate-50', 'text-slate-600', 'bg-slate-100')}
                            {renderCard('progress', 'Progress', Activity, 'text-blue-500', 'bg-slate-50', 'text-blue-600', 'bg-blue-50')}
                            {renderCard('testing', 'Testing', Target, 'text-amber-500', 'bg-slate-50', 'text-amber-600', 'bg-amber-50')}
                            {renderCard('done', 'Done', CheckCircle2, 'text-green-500', 'bg-slate-50', 'text-green-600', 'bg-green-50')}
                        </div>
                    </DragDropContext>
                </div>
            </div>
        </ProjectLayout>
    );
}
