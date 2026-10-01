<div class="h-full overflow-y-auto w-full pb-12">
    <div class="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-8 flex justify-between items-center sticky top-4 mx-4 rounded-3xl z-10 shadow-lg">
        <div>
            <h2 class="font-extrabold text-3xl text-white leading-tight drop-shadow-md">
                {{ __('Projects') }}
            </h2>
            <p class="text-sm font-medium text-white/70 mt-1">Manage and view all your workspaces.</p>
        </div>
        <button wire:click="$set('showCreateModal', true)" class="bg-white text-[#0052CC] hover:bg-gray-100 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Create Project
        </button>
    </div>

    <div class="py-8">
        <div class="max-w-7xl mx-auto px-6 sm:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                @forelse ($projects ?? [] as $project)
                    <a href="{{ route('projects.board', $project) }}" class="block bg-white/10 backdrop-blur-lg overflow-hidden shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/50 hover:-translate-y-1 group relative">
                        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div class="p-8 relative z-10">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4C9AFF] to-[#0052CC] flex items-center justify-center text-white font-extrabold text-2xl shadow-lg border border-white/30 transform group-hover:scale-105 transition-transform duration-300">
                                    {{ substr($project->name, 0, 1) }}
                                </div>
                                <div>
                                    <h4 class="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">{{ $project->name }}</h4>
                                    <span class="text-xs font-bold text-white/80 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md">{{ $project->key }}</span>
                                </div>
                            </div>
                            <p class="text-sm font-medium text-white/70 line-clamp-2">{{ $project->description ?: 'No description provided.' }}</p>
                            <div class="mt-6 pt-5 border-t border-white/20 flex items-center justify-between text-sm">
                                <span class="font-bold text-[#4C9AFF] flex items-center gap-1 group-hover:gap-2 transition-all">Go to Board <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></span>
                            </div>
                        </div>
                    </a>
                @empty
                    <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-white/5 backdrop-blur-lg rounded-3xl border-2 border-dashed border-white/20 p-16 text-center shadow-lg">
                        <div class="mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white/70 mb-6 shadow-inner border border-white/10">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">No projects yet</h3>
                        <p class="text-white/70 font-medium mb-8">Create your first project to get started with agile management.</p>
                        <button wire:click="$set('showCreateModal', true)" class="bg-white text-[#0052CC] hover:bg-gray-100 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            Create Project
                        </button>
                    </div>
                @endforelse
            </div>
        </div>
    </div>

    <!-- Create Project Modal -->
    @if($showCreateModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md transition-opacity" wire:click="$set('showCreateModal', false)"></div>
            <div class="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-lg z-10 flex flex-col overflow-hidden transform transition-all">
                <div class="px-8 py-6 border-b border-white/20 flex justify-between items-center bg-white/5">
                    <h2 class="text-xl font-bold text-white">Create Project</h2>
                    <button wire:click="$set('showCreateModal', false)" class="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div class="p-8">
                    <form wire:submit="createProject" class="space-y-5 text-left">
                        <div>
                            <label class="block text-sm font-bold text-white/90 mb-2">Project Name <span class="text-red-400">*</span></label>
                            <input type="text" wire:model="name" class="w-full border border-white/20 rounded-xl px-4 py-3 text-sm focus:border-[#4C9AFF] focus:ring-0 bg-white/10 focus:bg-white/20 transition-colors font-medium text-white placeholder-white/50" required placeholder="e.g. Website Redesign">
                            @error('name') <span class="text-red-400 text-xs font-medium mt-1 block">{{ $message }}</span> @enderror
                        </div>
                        
                        <div>
                            <label class="block text-sm font-bold text-white/90 mb-2">Project Key <span class="text-red-400">*</span></label>
                            <input type="text" wire:model="key" class="w-full border border-white/20 rounded-xl px-4 py-3 text-sm focus:border-[#4C9AFF] focus:ring-0 bg-white/10 focus:bg-white/20 transition-colors font-bold text-white uppercase placeholder-white/50" maxlength="10" required placeholder="e.g. WEB">
                            <p class="text-xs font-medium text-white/60 mt-2">A unique identifier for this project.</p>
                            @error('key') <span class="text-red-400 text-xs font-medium mt-1 block">{{ $message }}</span> @enderror
                        </div>
                        
                        <div>
                            <label class="block text-sm font-bold text-white/90 mb-2">Description</label>
                            <textarea wire:model="description" rows="3" class="w-full border border-white/20 rounded-xl px-4 py-3 text-sm focus:border-[#4C9AFF] focus:ring-0 bg-white/10 focus:bg-white/20 transition-colors font-medium text-white placeholder-white/50" placeholder="What is this project about?"></textarea>
                        </div>
                        
                        <div class="flex justify-end gap-3 pt-6 mt-4">
                            <button type="button" wire:click="$set('showCreateModal', false)" class="px-6 py-2.5 text-sm font-bold text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors border border-transparent">Cancel</button>
                            <button type="submit" class="bg-white text-[#0052CC] hover:bg-gray-100 px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    @endif
</div>

