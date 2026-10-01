import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layout, Zap, Users } from 'lucide-react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 selection:bg-brand selection:text-white">
            {/* Header / Navbar */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
                    <div className="flex lg:flex-1 items-center gap-3">
                        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                            T
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">TaskBan</span>
                    </div>
                    <div className="flex flex-1 justify-end items-center gap-6">
                        <Link to="/login" className="text-sm font-semibold leading-6 text-slate-900 hover:text-brand transition-colors">
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                        >
                            Get started <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </nav>
            </header>

            <main>
                {/* Hero Section */}
                <div className="relative isolate pt-14">
                    {/* Background decorative blob */}
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none" aria-hidden="true">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-brand opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                    </div>

                    <div className="py-24 sm:py-32 lg:pb-40">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl mb-6">
                                    Manage your projects with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-500">TaskBan</span>
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-slate-600 mb-10">
                                    A powerful, intuitive, and beautiful Kanban board designed to keep your team organized and your projects on track. Experience seamless task management today.
                                </p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <Link
                                        to="/register"
                                        className="rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-brand-hover hover:shadow-xl transition-all hover:-translate-y-1 group flex items-center gap-2"
                                    >
                                        Start for free
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link to="/login" className="text-base font-semibold leading-6 text-slate-900 hover:text-brand transition-colors">
                                        View Demo <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Dashboard Preview Image/Mock */}
                            <div className="mt-16 sm:mt-24">
                                <div className="relative rounded-2xl bg-white/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-3xl lg:p-4 shadow-2xl backdrop-blur-sm transition-transform hover:scale-[1.01] duration-500">
                                    <div className="rounded-xl bg-white ring-1 ring-slate-900/5 shadow-sm overflow-hidden flex flex-col h-[400px]">
                                        <div className="h-12 border-b border-slate-100 flex items-center px-4 bg-slate-50/50">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-surface p-8 flex gap-6 overflow-hidden relative">
                                            {/* Dummy Kanban Columns */}
                                            <div className="w-72 bg-slate-100/50 rounded-xl p-4 border border-slate-200/50 flex flex-col gap-3">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">To Do <span className="ml-2">2</span></div>
                                                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-sm font-medium">Design landing page</div>
                                                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-sm font-medium">Setup database schema</div>
                                            </div>
                                            <div className="w-72 bg-slate-100/50 rounded-xl p-4 border border-slate-200/50 flex flex-col gap-3">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">In Progress <span className="ml-2">1</span></div>
                                                <div className="bg-white p-4 rounded-lg shadow-[0_4px_20px_-4px_rgba(0,82,204,0.15)] border-brand/30 ring-1 ring-brand/30 text-sm font-medium transform -translate-y-1 transition-all">Implement Auth flow</div>
                                            </div>
                                            <div className="w-72 bg-slate-100/50 rounded-xl p-4 border border-slate-200/50 flex flex-col gap-3">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Done <span className="ml-2">3</span></div>
                                                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-sm font-medium opacity-70">Initialize Laravel project</div>
                                            </div>
                                            {/* Overlay gradient */}
                                            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface to-transparent"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
                        <div className="mx-auto max-w-2xl sm:text-center mb-16">
                            <h2 className="text-base font-semibold leading-7 text-brand">Everything you need</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">No-nonsense task management</p>
                        </div>
                        <div className="mx-auto max-w-2xl lg:max-w-none">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                <div className="flex flex-col bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand mb-4">
                                            <Layout size={24} />
                                        </div>
                                    </dt>
                                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">Intuitive Kanban Boards</h3>
                                        <p className="flex-auto">Drag and drop issues across columns. Organize your workflow effortlessly with a UI that gets out of your way.</p>
                                    </dd>
                                </div>
                                <div className="flex flex-col bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 mb-4">
                                            <Zap size={24} />
                                        </div>
                                    </dt>
                                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">Lightning Fast</h3>
                                        <p className="flex-auto">Built on a modern React SPA architecture. Experience zero page reloads and instant optimistic UI updates.</p>
                                    </dd>
                                </div>
                                <div className="flex flex-col bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500 mb-4">
                                            <Users size={24} />
                                        </div>
                                    </dt>
                                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">Team Collaboration</h3>
                                        <p className="flex-auto">Assign tasks, track progress, and keep everyone on the same page. Perfect for teams of all sizes.</p>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
