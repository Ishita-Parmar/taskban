<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'TaskBan') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        
        <!-- Alpine Sortable -->
        <script src="https://cdn.jsdelivr.net/npm/@alpinejs/sort@3.14.x/dist/cdn.min.js" defer></script>
    </head>
    <body class="antialiased font-['Inter',sans-serif] bg-gradient-to-br from-[#0B0F19] via-[#1A233A] to-[#0052CC] text-white flex flex-col h-screen w-screen overflow-hidden selection:bg-[#0052CC] selection:text-white relative">
        <!-- Background effects -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#0052CC]/20 blur-[120px]"></div>
            <div class="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#4C9AFF]/10 blur-[100px]"></div>
        </div>

        <div class="flex flex-col h-full w-full relative z-10">
            <!-- Global Top Navigation (Jira style) -->
            <header class="h-14 bg-white/10 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-4 z-30 shrink-0 shadow-sm">
                <div class="flex items-center gap-6">
                    <!-- Logo -->
                    <a href="{{ route('dashboard') }}" class="flex items-center gap-1.5 text-white hover:text-blue-200 transition-colors drop-shadow-md">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM9 17H7V7h2v10zm4 0h-2V7h2v10zm4 0h-2V7h2v10z"/>
                        </svg>
                        <span class="text-xl font-bold tracking-tight text-white">TaskBan</span>
                    </a>
                    
                    <!-- Main Links -->
                    <nav class="flex gap-1">
                        <a href="{{ route('dashboard') }}" class="px-3 py-1.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white rounded transition-colors">Projects</a>
                    </nav>
                </div>
                
                <div class="flex items-center gap-4">
                    <!-- User Profile Dropdown -->
                    <div x-data="{ open: false }" class="relative">
                        <button @click="open = !open" @click.outside="open = false" type="button" class="flex items-center gap-2 hover:bg-white/10 p-1.5 rounded transition-colors" title="Account">
                            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-[#0B0F19] to-[#0052CC] border border-white/20 flex items-center justify-center text-xs text-white font-bold overflow-hidden shadow-md">
                                @if(auth()->user()?->avatar_url)
                                    <img src="{{ auth()->user()->avatar_url }}" alt="User">
                                @else
                                    {{ auth()->user()?->initials() ?? 'U' }}
                                @endif
                            </div>
                        </button>
                        
                        <!-- Dropdown Menu -->
                        <div x-show="open" 
                             x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="transform opacity-0 scale-95"
                             x-transition:enter-end="transform opacity-100 scale-100"
                             x-transition:leave="transition ease-in duration-75"
                             x-transition:leave-start="transform opacity-100 scale-100"
                             x-transition:leave-end="transform opacity-0 scale-95"
                             class="absolute right-0 mt-2 w-48 bg-[#1A233A] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
                             style="display: none;">
                            <div class="px-4 py-3 border-b border-white/10">
                                <p class="text-sm font-medium text-white">{{ auth()->user()->name ?? 'User' }}</p>
                                <p class="text-xs text-white/60 truncate">{{ auth()->user()->email ?? '' }}</p>
                            </div>
                            <div class="py-1">
                                <a href="{{ route('profile') }}" class="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors">Profile</a>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors">
                                        Log Out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main App Container -->
            <div class="flex flex-1 overflow-hidden">
                
                <!-- Left Sidebar (Glassmorphic) -->
                @php
                    $sidebarProject = $project ?? request()->route('project');
                @endphp
                @if($sidebarProject)
                <aside class="w-[240px] flex-shrink-0 bg-white/5 backdrop-blur-md border-r border-white/20 flex flex-col z-20 shadow-xl">
                    <!-- Project Header -->
                    <div class="p-4 pb-2">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0052CC] border border-white/20 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                {{ substr($sidebarProject->name ?? 'T', 0, 1) }}
                            </div>
                            <div>
                                <h2 class="font-semibold text-sm leading-tight text-white">{{ $sidebarProject->name ?? 'TaskBan Dev' }}</h2>
                                <p class="text-xs text-white/60">Software Project</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation Links -->
                    <nav class="flex-1 p-2 space-y-1">
                        @php
                            $isBoard = request()->routeIs('projects.board');
                            $isBacklog = request()->routeIs('projects.backlog');
                            $isSettings = request()->routeIs('projects.settings');
                            $projectId = $sidebarProject->id ?? 1;
                        @endphp
                        
                        <a href="{{ route('projects.board', $projectId) }}" wire:navigate class="block px-3 py-2 text-sm rounded-lg font-medium transition-colors {{ $isBoard ? 'bg-white/20 text-white shadow-inner border border-white/10' : 'text-white/70 hover:bg-white/10 hover:text-white' }}">
                            Kanban Board
                        </a>
                        <a href="{{ route('projects.backlog', $projectId) }}" wire:navigate class="block px-3 py-2 text-sm rounded-lg font-medium transition-colors {{ $isBacklog ? 'bg-white/20 text-white shadow-inner border border-white/10' : 'text-white/70 hover:bg-white/10 hover:text-white' }}">
                            Backlog
                        </a>
                        <a href="{{ route('projects.settings', $projectId) }}" wire:navigate class="block px-3 py-2 text-sm rounded-lg font-medium transition-colors {{ $isSettings ? 'bg-white/20 text-white shadow-inner border border-white/10' : 'text-white/70 hover:bg-white/10 hover:text-white' }}">
                            Project Settings
                        </a>
                    </nav>
                </aside>
                @endif

                <!-- Main Content Area -->
                <main class="flex-1 flex flex-col min-w-0 bg-transparent">
                    {{ $slot }}
                </main>
            </div>
        </div>
    </body>
</html>
