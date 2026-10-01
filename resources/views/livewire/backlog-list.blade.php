<div class="flex flex-col h-full overflow-hidden">
    <!-- Top Header -->
    <header class="h-14 border-b border-white/20 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md z-10">
        <h1 class="text-xl font-bold text-white drop-shadow-md">Backlog</h1>
        <span class="bg-white/20 text-white px-2 py-0.5 rounded text-xs font-medium">{{ count($issues) }} issues</span>
    </header>

    <!-- Filters Bar -->
    <div class="p-4 flex gap-4 items-center bg-transparent z-10 border-b border-white/20">
        <div class="relative">
            <input type="text" wire:model.live.debounce.300ms="searchQuery" placeholder="Search backlog" class="border border-white/20 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] bg-white/10 backdrop-blur-sm transition-colors pl-8">
            <svg class="w-4 h-4 text-white/70 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        
        <select wire:model.live="filterType" class="border border-white/20 rounded px-3 py-1.5 text-sm bg-white/10 backdrop-blur-sm text-white/70">
            <option value="">Type</option>
            <option value="epic">Epic</option>
            <option value="story">Story</option>
            <option value="task">Task</option>
            <option value="bug">Bug</option>
        </select>
        
        <select wire:model.live="filterPriority" class="border border-white/20 rounded px-3 py-1.5 text-sm bg-white/10 backdrop-blur-sm text-white/70">
            <option value="">Priority</option>
            <option value="highest">Highest</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="lowest">Lowest</option>
        </select>
    </div>

    <!-- Issue List -->
    <div class="flex-1 overflow-y-auto p-6 space-y-1">
        <!-- Inline Create -->
        @if(!$showInlineCreate)
            <div wire:click="$set('showInlineCreate', true)" class="flex items-center gap-2 p-2 border border-dashed border-white/20 rounded bg-white/10 text-white/70 hover:bg-white/20 cursor-pointer transition-colors mb-4">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                <span class="text-sm font-medium">Create issue</span>
            </div>
        @else
            <form wire:submit="createInlineIssue" class="flex items-center gap-2 p-2 border border-white/20 rounded bg-white/10 shadow-sm mb-4">
                <select wire:model="inlineType" class="border-transparent rounded py-1 px-2 text-sm focus:border-[#4C9AFF] focus:ring-[#4C9AFF] bg-white/5">
                    <option value="story">Story</option>
                    <option value="task">Task</option>
                    <option value="bug">Bug</option>
                    <option value="epic">Epic</option>
                </select>
                <input type="text" wire:model="inlineSummary" placeholder="What needs to be done?" class="flex-1 border-transparent focus:border-transparent focus:ring-0 text-sm p-1" autofocus>
                <button type="button" wire:click="$set('showInlineCreate', false)" class="text-white/70 hover:text-white px-2 py-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                <button type="submit" class="bg-white hover:bg-gray-100 text-[#4C9AFF] font-bold shadow-md hover:-translate-y-0.5 transition-all px-3 py-1 rounded text-sm font-medium">Add</button>
            </form>
        @endif
        
        <div x-data x-sort="if(event.item) { @this.reorderIssue(event.item.dataset.id, event.newIndex * 1000) }" class="space-y-1">
        @foreach($issues as $issue)
            <div data-id="{{ $issue->id }}" class="flex items-center gap-4 p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded shadow-sm hover:bg-white/10 hover:shadow transition-all group">
                <div x-sort:handle class="cursor-grab text-[#DFE1E6] group-hover:text-white/70">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
                </div>
                
                <div class="flex-1 flex items-center gap-3">
                    @php $typeColor = $issue->type->color(); @endphp
                    <span class="inline-flex items-center justify-center w-4 h-4 rounded-sm text-white text-[9px] font-bold" style="background-color: {{ $typeColor }}" title="{{ $issue->type->label() }}">
                        @if($issue->type->value === 'bug')
                            <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="3"/></svg>
                        @elseif($issue->type->value === 'task')
                            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 16 16"><path d="M3 8l3 3 7-7"/></svg>
                        @elseif($issue->type->value === 'story')
                            <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 16 16"><rect x="3" y="2" width="10" height="12" rx="1"/></svg>
                        @else
                            <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 16 16"><path d="M3 2h10l-5 6 5 6H3l5-6z"/></svg>
                        @endif
                    </span>
                    <a href="{{ route('projects.board', $project->id) }}" class="text-xs font-medium text-white/70 hover:underline group-hover:text-[#4C9AFF]">{{ $issue->issue_key }}</a>
                    <span class="text-sm text-white font-medium">{{ $issue->summary }}</span>
                </div>
                
                <div class="flex items-center gap-4">
                    <!-- Status -->
                    <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-sm {{ $issue->column->name == 'Done' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : ($issue->column->name == 'To Do' ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30') }}">
                        {{ $issue->column->name }}
                    </span>
                    
                    <!-- Priority Icon -->
                    <div title="{{ $issue->priority->label() }}" class="w-4">
                        @if($issue->priority->value === 'highest' || $issue->priority->value === 'high')
                            <svg class="w-4 h-4 text-[#FF5630]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                        @elseif($issue->priority->value === 'medium')
                            <svg class="w-4 h-4 text-[#FF991F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        @else
                            <svg class="w-4 h-4 text-[#36B37E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                        @endif
                    </div>
                    
                    <!-- Assignee -->
                    @if($issue->assignee)
                        <div class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-white overflow-hidden shadow-sm" title="{{ $issue->assignee->name }}">
                            @if($issue->assignee->avatar_url)
                                <img src="{{ $issue->assignee->avatar_url }}" alt="{{ $issue->assignee->name }}">
                            @else
                                {{ $issue->assignee->initials() }}
                            @endif
                        </div>
                    @else
                        <div class="w-6 h-6 rounded-full border border-dashed border-white/20 flex items-center justify-center text-[10px] text-white/70" title="Unassigned">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                    @endif
                </div>
            </div>
        @endforeach
        </div>
    </div>
</div>
