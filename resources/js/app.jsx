import '../css/app.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from './Pages/Dashboard';
import Projects from './Pages/Projects';
import ProjectOverview from './Pages/ProjectOverview';
import ProjectWorkspaceOverview from './Pages/ProjectWorkspaceOverview';
import ProjectBoard from './Pages/ProjectBoard';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Welcome from './Pages/Welcome';
import Backlog from './Pages/Backlog';
import ProjectSettings from './Pages/ProjectSettings';
import MemberDashboard from './Pages/MemberDashboard';
import Reports from './Pages/Reports';
import CalendarView from './Pages/Calendar';
import SuperAdminDashboard from './Pages/SuperAdminDashboard';
import TeamMemberDashboard from './Pages/TeamMemberDashboard';

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectOverview />} />
                    <Route path="/project-workspace/:id/overview" element={<ProjectWorkspaceOverview />} />
                    <Route path="/project-workspace/:id/board" element={<ProjectBoard />} />
                    
                    {/* The following routes currently don't use the project ID in their path.
                        They will need to be updated to match the new ProjectLayout sidebar, 
                        e.g., /project-workspace/:id/board, etc. 
                        We keep them here for now so they don't break. */}
                    <Route path="/backlog" element={<Backlog />} />
                    <Route path="/settings" element={<ProjectSettings />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/super-admin" element={<SuperAdminDashboard />} />
                    <Route path="/team-member" element={<TeamMemberDashboard />} />
                    <Route path="/member/:memberId/dashboard" element={<MemberDashboard />} />
                    <Route path="/*" element={<Welcome />} />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}
