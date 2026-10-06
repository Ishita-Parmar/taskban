import React, { useState } from 'react';
import { useAuthStore } from '../Stores/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const { register } = useAuthStore();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('manager');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ name, email, password, role });
            if (role === 'admin') navigate('/super-admin');
            else if (role === 'member') navigate('/team-member');
            else navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Please check your details.');
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-surface">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-border p-10">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-sm mb-5">
                        T
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create an account</h1>
                    <p className="text-slate-500 text-sm mt-2">Sign up for TaskBan</p>
                </div>
                
                {error && <div className="bg-status-danger/10 text-status-danger p-3 rounded-xl text-sm mb-5 text-center font-medium">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Name</label>
                        <input 
                            type="text" 
                            className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-surface transition-colors"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required 
                            autoComplete="name"
                            placeholder="Jane Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Email</label>
                        <input 
                            type="email" 
                            className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-surface transition-colors"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required 
                            autoComplete="email"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Password</label>
                        <input 
                            type="password" 
                            className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-surface transition-colors"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required 
                            autoComplete="new-password"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Role</label>
                        <select 
                            className="w-full border border-slate-border rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-surface transition-colors"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                        >
                            <option value="manager">Manager</option>
                            <option value="member">Team Member</option>
                            <option value="admin">Super Admin</option>
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-brand hover:bg-brand-hover text-white py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm"
                    >
                        Sign up
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand font-semibold hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
