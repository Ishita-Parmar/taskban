import '../css/app.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Welcome from './Pages/Welcome';
import Backlog from './Pages/Backlog';
import ProjectSettings from './Pages/ProjectSettings';
import MemberDashboard from './Pages/MemberDashboard';
import Reports from './Pages/Reports';
import CalendarView from './Pages/Calendar';

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
                    <Route path="/backlog" element={<Backlog />} />
                    <Route path="/settings" element={<ProjectSettings />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/member/:memberId/dashboard" element={<MemberDashboard />} />
                    <Route path="/*" element={<Welcome />} />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}
