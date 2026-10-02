import React from 'react';
import AppLayout from '../Layouts/AppLayout';

export default function Backlog() {
    return (
        <AppLayout>
            <div className="p-8">
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">Backlog</h1>
                <div className="bg-white rounded-2xl border border-slate-border p-8 text-center text-slate-500 shadow-sm">
                    Backlog feature is coming soon.
                </div>
            </div>
        </AppLayout>
    );
}
