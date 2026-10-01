<div class="flex flex-col h-full overflow-hidden">
    <!-- Top Header -->
    <header class="h-14 border-b border-white/20 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md z-10">
        <h1 class="text-xl font-bold text-white drop-shadow-md">Board</h1>
        <button wire:click="$set(\'showCreateModal\', true)" class="bg-white text-[#4C9AFF] hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Create Issue
        </button>
    </header>

    <!-- Filters Bar -->
    <div class="p-4 flex gap-4 items-center bg-transparent z-10">
        <div class="relative">
            <input type="text" wire:model.live.debounce.300ms="searchQuery" placeholder="Search this board" class="border border-white/20 rounded-full px-4 py-2 text-sm w-56 focus:outline-none focus:border-[#4C9AFF] bg-white/10 backdrop-blur-md text-white placeholder-white/50 transition-colors pl-9">
            <svg class="w-4 h-4 text-white/50 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        
        <div class="flex -space-x-2">
            @foreach($projectMembers->take(5) as $member)
                <div class="w-9 h-9 rounded-full border-2 border-white/20 bg-gradient-to-br from-[#0B0F19] to-[#0052CC] flex items-center justify-center text-xs font-bold text-white overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform shadow-lg" title="{{ $member->name }}">
                    @if($member->avatar_url)
                        <img src="{{ $member->avatar_url }}" alt="{{ $member->name }}">
                    @else
                        {{ $member->initials() }}
                    @endif
                </div>
            @endforeach
        </div>
        
        <button wire:click="toggleMyIssues" class="text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 {{ $filterMyIssues ? 'bg-white text-[#4C9AFF] shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white' }}">
            Only my issues
        </button>
    </div>

    <!-- Board Columns Wrapper -->
    <div class="flex-1 overflow-x-auto overflow-y-hidden px-4 pb-4 flex gap-4 items-start" wire:ignore.self>
        
        @foreach($columns as $column)
            <!-- Column -->
            <div class="w-[300px] min-w-[300px] bg-white/5 backdrop-blur-xl rounded-3xl flex flex-col max-h-full border border-white/10 shadow-lg"
                 x-data="{ columnId: {{ $column->id }} }"
                 @dragover.prevent="$el.classList.add(\'bg-white/10\')"
                 @dragleave.prevent="$el.classList.remove(\'bg-white/10\')"
                 @drop.prevent="$el.classList.remove(\'bg-white/10\'); let issueId = event.dataTransfer.getData('text/plain'); if(issueId) { @this.moveIssue(issueId, columnId, Date.now()) }">
                
                <!-- Column Header -->
                <div class="p-3 pb-2 sticky top-0 z-10 flex justify-between items-center bg-transparent rounded-t-3xl border-b border-transparent">
                    <h3 class="text-xs font-bold text-white/70 uppercase tracking-wider">{{ $column->name }} <span class="text-white ml-2 bg-white/20 px-2 py-0.5 rounded-full">{{ $column->issues->count() }}</span></h3>
                </div>
                
                <!-- Column Body -->
                <div class="flex-1 overflow-y-auto px-2 pb-2 space-y-2 min-h-[50px]" id="column-{{ $column->id }}">
                    
                    @foreach($column->issues as $issue)
                        <!-- Card -->
                        <div draggable="true"
                             @dragstart="event.dataTransfer.setData('text/plain', {{ $issue->id }}); event.dataTransfer.effectAllowed = 'move'; $el.classList.add('opacity-50')"
                             @dragend="$el.classList.remove('opacity-50')"
                             wire:click="openIssue({{ $issue->id }})"
                             class="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 cursor-grab active:cursor-grabbing hover:bg-white/20 hover:border-white/40 transition-all duration-300 group">
                            
                            <div class="text-sm font-medium text-white mb-4 leading-relaxed">{{ $issue->summary }}</div>
                            
                            <div class="flex items-center justify-between mt-auto">
                                <div class="flex items-center gap-2">
                                    {{-- Issue Type Icon (16x16 colored square) --}}
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
                                    <span class="text-xs text-white/60 font-bold hover:underline group-hover:text-blue-300">{{ $issue->issue_key }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <!-- Priority Icon -->
                                    <div title="{{ $issue->priority->label() }}">
                                        @if($issue->priority->value === 'highest' || $issue->priority->value === 'high')
                                            <svg class="w-4 h-4 text-red-400 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                                        @elseif($issue->priority->value === 'medium')
                                            <svg class="w-4 h-4 text-orange-400 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                        @else
                                            <svg class="w-4 h-4 text-green-400 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                                        @endif
                                    </div>
                                    
                                    <!-- Assignee Avatar -->
                                    @if($issue->assignee)
                                        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-[#0B0F19] to-[#0052CC] border border-white/20 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden shadow-sm" title="{{ $issue->assignee->name }}">
                                            @if($issue->assignee->avatar_url)
                                                <img src="{{ $issue->assignee->avatar_url }}" alt="{{ $issue->assignee->name }}">
                                            @else
                                                {{ $issue->assignee->initials() }}
                                            @endif
                                        </div>
                                    @else
                                        <div class="w-7 h-7 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-[10px] text-white/50" title="Unassigned">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </div>
                    @endforeach
                    
                </div>
            </div>
        @endforeach

    </div>

    <!-- Modals -->
    @if($showCreateModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" wire:click="$set('showCreateModal', false)"></div>
            <div class="bg-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden border border-white/20">
                <div class="px-6 py-4 border-b border-white/20 flex justify-between items-center bg-white/5">
                    <h2 class="text-xl font-medium text-white">Create Issue</h2>
                    <button wire:click="$set('showCreateModal', false)" class="text-white/70 hover:text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <form wire:submit="createIssue" class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-white/70 mb-1">Issue Type</label>
                        <select wire:model="newIssueType" class="w-full border border-white/20 rounded-xl px-3 py-2 text-sm focus:border-[#4C9AFF] focus:ring-1 focus:ring-[#4C9AFF] bg-white/10 text-white placeholder-white/50 [&>option]:bg-[#1A233A] [&>option]:text-white">
                            <option value="task">Task</option>
                            <option value="bug">Bug</option>
                            <option value="story">Story</option>
                            <option value="epic">Epic</option>
                        </select>
                        @error('newIssueType') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-white/70 mb-1">Summary <span class="text-red-500">*</span></label>
                        <input type="text" wire:model="newIssueSummary" class="w-full border border-white/20 rounded-xl px-3 py-2 text-sm focus:border-[#4C9AFF] focus:ring-1 focus:ring-[#4C9AFF] bg-white/10 text-white placeholder-white/50 [&>option]:bg-[#1A233A] [&>option]:text-white">
                        @error('newIssueSummary') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-white/70 mb-1">Description</label>
                        <textarea wire:model="newIssueDescription" rows="4" class="w-full border border-white/20 rounded-xl px-3 py-2 text-sm focus:border-[#4C9AFF] focus:ring-1 focus:ring-[#4C9AFF] bg-white/10 text-white placeholder-white/50 [&>option]:bg-[#1A233A] [&>option]:text-white"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold text-white/70 mb-1">Priority</label>
                            <select wire:model="newIssuePriority" class="w-full border border-white/20 rounded-xl px-3 py-2 text-sm focus:border-[#4C9AFF] focus:ring-1 focus:ring-[#4C9AFF] bg-white/10 text-white placeholder-white/50 [&>option]:bg-[#1A233A] [&>option]:text-white">
                                <option value="highest">Highest</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                                <option value="lowest">Lowest</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-white/70 mb-1">Assignee</label>
                            <select wire:model="newIssueAssignee" class="w-full border border-white/20 rounded-xl px-3 py-2 text-sm focus:border-[#4C9AFF] focus:ring-1 focus:ring-[#4C9AFF] bg-white/10 text-white placeholder-white/50 [&>option]:bg-[#1A233A] [&>option]:text-white">
                                <option value="">Unassigned</option>
                                @foreach($projectMembers as $member)
                                    <option value="{{ $member->id }}">{{ $member->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    
                    <div class="pt-4 flex justify-end gap-3">
                        <button type="button" wire:click="$set('showCreateModal', false)" class="px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 rounded-full transition-colors">Cancel</button>
                        <button type="submit" class="px-4 py-2 text-sm font-medium bg-white text-[#4C9AFF] hover:bg-gray-100 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">Create</button>
                    </div>
                </form>
            </div>
        </div>
    @endif

    @if($showIssueModal && $selectedIssue)
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" wire:click="$set('showIssueModal', false)"></div>
            <div class="bg-[#0B0F19]/90 backdrop-blur-3xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col z-10 border border-white/20 text-white">
                <div class="px-6 py-4 border-b border-white/20 flex justify-between items-center bg-white/5 rounded-t-3xl">
                    <div class="flex items-center gap-3 text-white/70 text-sm">
                        {{-- Issue Type Icon --}}
                        @php $modalTypeColor = $selectedIssue->type->color(); @endphp
                        <span class="inline-flex items-center justify-center w-5 h-5 rounded-sm text-white text-[10px] font-bold" style="background-color: {{ $modalTypeColor }}" title="{{ $selectedIssue->type->label() }}">
                            @if($selectedIssue->type->value === 'bug')
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="3"/></svg>
                            @elseif($selectedIssue->type->value === 'task')
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 16 16"><path d="M3 8l3 3 7-7"/></svg>
                            @elseif($selectedIssue->type->value === 'story')
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 16 16"><rect x="3" y="2" width="10" height="12" rx="1"/></svg>
                            @else
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 16 16"><path d="M3 2h10l-5 6 5 6H3l5-6z"/></svg>
                            @endif
                        </span>
                        <span class="text-xs uppercase font-bold text-white/70">{{ $selectedIssue->type->label() }}</span>
                        <span class="font-medium hover:underline cursor-pointer text-[#4C9AFF]">{{ $selectedIssue->issue_key }}</span>
                    </div>
                    <button wire:click="$set('showIssueModal', false)" class="text-white/70 hover:text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div class="flex-1 overflow-y-auto flex">
                    <!-- Left Column (70%) -->
                    <div class="w-[70%] p-6 border-r border-white/20">
                        <input type="text" wire:model.blur="editSummary" wire:change="updateIssue" class="w-full text-2xl font-bold text-white border-transparent hover:bg-white/10 focus:border-[#4C9AFF] focus:ring-1 focus:ring-[#4C9AFF] focus:bg-white/10 rounded-lg px-2 -ml-2 mb-4 transition-colors bg-transparent">
                        
                        <div class="mb-8">
                            <h3 class="font-semibold text-white mb-2 text-sm">Description</h3>
                            <textarea wire:model.blur="editDescription" wire:change="updateIssue" rows="4" placeholder="Add a description..." class="w-full text-sm text-white/90 border-transparent hover:bg-white/10 focus:border-[#4C9AFF] focus:ring-1 focus:ring-[#4C9AFF] focus:bg-white/10 rounded-lg p-2 -ml-2 transition-colors bg-transparent placeholder-white/50"></textarea>
                        </div>
                        
                        <div>
                            <div class="flex gap-6 border-b border-white/20 mb-4">
                                <button wire:click="$set('activeDetailTab', 'comments')" class="pb-2 text-sm font-medium {{ $activeDetailTab === 'comments' ? 'text-[#4C9AFF] border-b-2 border-[#4C9AFF] text-[#4C9AFF]' : 'text-white/70 hover:text-white' }}">Comments</button>
                                <button wire:click="$set('activeDetailTab', 'history')" class="pb-2 text-sm font-medium {{ $activeDetailTab === 'history' ? 'text-[#4C9AFF] border-b-2 border-[#4C9AFF] text-[#4C9AFF]' : 'text-white/70 hover:text-white' }}">History</button>
                            </div>
                            
                            @if($activeDetailTab === 'comments')
                            <div class="space-y-4 mb-6">
                                @foreach($selectedIssue->comments as $comment)
                                    <div class="flex gap-3">
                                        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B0F19] to-[#0052CC] border border-white/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white overflow-hidden shadow-md">
                                            @if($comment->user->avatar_url)
                                                <img src="{{ $comment->user->avatar_url }}" alt="{{ $comment->user->name }}">
                                            @else
                                                {{ $comment->user->initials() }}
                                            @endif
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2 mb-1">
                                                <span class="font-semibold text-sm text-white">{{ $comment->user->name }}</span>
                                                <span class="text-xs text-white/70">{{ $comment->created_at->diffForHumans() }}</span>
                                            </div>
                                            <div class="text-sm text-white">{{ $comment->body }}</div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                            
                            <div class="flex gap-3">
                                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B0F19] to-[#0052CC] border border-white/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white overflow-hidden shadow-md">
                                    @if(auth()->user()->avatar_url)
                                        <img src="{{ auth()->user()->avatar_url }}" alt="You">
                                    @else
                                        {{ auth()->user()->initials() }}
                                    @endif
                                </div>
                                <div class="flex-1">
                                    <textarea wire:model="newComment" rows="2" placeholder="Add a comment..." class="w-full border border-white/20 rounded-xl px-4 py-3 text-sm focus:border-[#4C9AFF] focus:ring-1 focus:ring-[#4C9AFF] bg-white/10 text-white placeholder-white/50 transition-colors"></textarea>
                                    <div class="mt-2 flex justify-end">
                                        <button wire:click="addComment" class="px-4 py-2 text-sm font-bold bg-white text-[#4C9AFF] hover:bg-gray-100 rounded-full transition-all shadow-md">Save</button>
                                    </div>
                                </div>
                            </div>
                            @else
                            {{-- History / Activity Log Tab --}}
                            <div class="space-y-3">
                                @forelse($selectedIssue->activities as $activity)
                                    <div class="flex gap-3 py-2">
                                        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B0F19] to-[#0052CC] border border-white/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white overflow-hidden shadow-md">
                                            @if($activity->user->avatar_url)
                                                <img src="{{ $activity->user->avatar_url }}" alt="{{ $activity->user->name }}">
                                            @else
                                                {{ $activity->user->initials() }}
                                            @endif
                                        </div>
                                        <div class="flex-1">
                                            <div class="text-sm text-white">
                                                <span class="font-semibold">{{ $activity->user->name }}</span>
                                                @if($activity->field === 'created')
                                                    created this issue
                                                @else
                                                    changed <span class="font-medium text-[#4C9AFF]">{{ $activity->field }}</span>
                                                    @if($activity->old_value)
                                                        from <span class="line-through text-white/70">{{ $activity->old_value }}</span>
                                                    @endif
                                                    to <span class="font-medium">{{ $activity->new_value }}</span>
                                                @endif
                                            </div>
                                            <div class="text-xs text-white/70 mt-0.5">{{ $activity->created_at->diffForHumans() }}</div>
                                        </div>
                                    </div>
                                @empty
                                    <div class="text-sm text-white/70 py-4 text-center">No activity recorded yet.</div>
                                @endforelse
                            </div>
                            @endif
                        </div>
                    </div>
                    
                    <!-- Right Column (30%) -->
                    <div class="w-[30%] p-6 bg-white/5">
                        <div class="space-y-6">
                            <div>
                                <h4 class="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Status</h4>
                                <div class="inline-block bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold uppercase shadow-sm">
                                    {{ $selectedIssue->column->name }}
                                </div>
                            </div>
                            
                            <div>
                                <h4 class="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Assignee</h4>
                                <select wire:model.change="editAssignee" wire:change="updateIssue" class="w-full border-transparent hover:bg-white/10 focus:border-[#4C9AFF] focus:ring-1 focus:ring-[#4C9AFF] focus:bg-white/10 rounded-lg px-2 py-1 -ml-2 text-sm text-white transition-colors bg-transparent [&>option]:bg-[#1A233A] [&>option]:text-white">
                                    <option value="">Unassigned</option>
                                    @foreach($projectMembers as $member)
                                        <option value="{{ $member->id }}">{{ $member->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                            
                            <div>
                                <h4 class="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Reporter</h4>
                                <div class="flex items-center gap-2 text-sm text-white">
                                    <div class="w-7 h-7 rounded-full bg-gradient-to-br from-[#0B0F19] to-[#0052CC] border border-white/20 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden shadow-sm">
                                        @if($selectedIssue->reporter->avatar_url)
                                            <img src="{{ $selectedIssue->reporter->avatar_url }}" alt="{{ $selectedIssue->reporter->name }}">
                                        @else
                                            {{ $selectedIssue->reporter->initials() }}
                                        @endif
                                    </div>
                                    <span>{{ $selectedIssue->reporter->name }}</span>
                                </div>
                            </div>
                            
                            <div>
                                <h4 class="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Priority</h4>
                                <select wire:model.change="editPriority" wire:change="updateIssue" class="w-full border-transparent hover:bg-white/10 focus:border-[#4C9AFF] focus:ring-1 focus:ring-[#4C9AFF] focus:bg-white/10 rounded-lg px-2 py-1 -ml-2 text-sm text-white transition-colors bg-transparent [&>option]:bg-[#1A233A] [&>option]:text-white">
                                    <option value="highest">Highest</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                    <option value="lowest">Lowest</option>
                                </select>
                            </div>
                            
                            <div class="pt-4 border-t border-white/20 text-xs text-white/60 space-y-2">
                                <div>Created {{ $selectedIssue->created_at->diffForHumans() }}</div>
                                <div>Updated {{ $selectedIssue->updated_at->diffForHumans() }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @endif
</div>
