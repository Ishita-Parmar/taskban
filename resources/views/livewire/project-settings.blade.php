<div class="flex flex-col h-full overflow-hidden">
    <!-- Top Header -->
    <header class="h-14 border-b border-white/20 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md z-10">
        <h1 class="text-xl font-bold text-white drop-shadow-md">Project Settings</h1>
    </header>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full">
        
        <!-- Tabs -->
        <div class="flex gap-6 border-b border-white/20 mb-8">
            <button wire:click="$set('activeTab', 'general')" class="pb-3 text-sm font-medium {{ $activeTab === 'general' ? 'text-[#4C9AFF] border-b-2 border-[#0052CC]' : 'text-white/70 hover:text-white' }}">General</button>
            <button wire:click="$set('activeTab', 'members')" class="pb-3 text-sm font-medium {{ $activeTab === 'members' ? 'text-[#4C9AFF] border-b-2 border-[#0052CC]' : 'text-white/70 hover:text-white' }}">Members</button>
            <button wire:click="$set('activeTab', 'columns')" class="pb-3 text-sm font-medium {{ $activeTab === 'columns' ? 'text-[#4C9AFF] border-b-2 border-[#0052CC]' : 'text-white/70 hover:text-white' }}">Workflow Columns</button>
        </div>
        
        <!-- General Tab -->
        @if($activeTab === 'general')
            <div class="bg-white/10 backdrop-blur-[12px] rounded-xl border border-white/40 p-8 shadow-sm">
                @if (session()->has('message'))
                    <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm relative" role="alert">
                        <span class="block sm:inline">{{ session('message') }}</span>
                    </div>
                @endif
                <form wire:submit="saveGeneral" class="space-y-6 max-w-xl">
                    <div>
                        <label class="block text-sm font-semibold text-white/70 mb-1">Project Name</label>
                        <input type="text" wire:model="name" class="w-full border border-white/20 rounded px-3 py-2 text-sm focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] bg-white/10 text-white transition-colors [&>option]:bg-[#1A233A] [&>option]:text-white">
                        @error('name') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-white/70 mb-1">Project Key</label>
                        <input type="text" value="{{ $project->key }}" disabled readonly class="w-full border border-white/20 rounded px-3 py-2 text-sm bg-white/10 text-white/70 cursor-not-allowed">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-white/70 mb-1">Description</label>
                        <textarea wire:model="description" rows="4" class="w-full border border-white/20 rounded px-3 py-2 text-sm focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] bg-white/10 text-white transition-colors [&>option]:bg-[#1A233A] [&>option]:text-white"></textarea>
                    </div>
                    
                    <div>
                        <button type="submit" class="bg-white hover:bg-gray-100 text-[#4C9AFF] font-bold shadow-md hover:-translate-y-0.5 transition-all px-5 py-2 rounded text-sm font-medium transition-colors shadow-sm">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        @endif
        
        <!-- Members Tab -->
        @if($activeTab === 'members')
            <div class="bg-white/10 backdrop-blur-[12px] rounded-xl border border-white/40 shadow-sm overflow-hidden">
                <div class="p-4 border-b border-white/20 flex justify-between items-center bg-white/10">
                    <h3 class="font-medium text-white">Project Members</h3>
                    <button wire:click="$set('showInviteModal', true)" class="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">Invite Member</button>
                </div>
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-white/10 text-white/70 text-xs uppercase tracking-wider border-b border-white/20">
                            <th class="p-4 font-semibold">User</th>
                            <th class="p-4 font-semibold">Email</th>
                            <th class="p-4 font-semibold">Role</th>
                            <th class="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/20">
                        @foreach($members as $member)
                            <tr class="hover:bg-white/10 transition-colors">
                                <td class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white overflow-hidden shadow-sm">
                                            @if($member->avatar_url)
                                                <img src="{{ $member->avatar_url }}" alt="{{ $member->name }}">
                                            @else
                                                {{ $member->initials() }}
                                            @endif
                                        </div>
                                        <span class="font-medium text-sm text-white">{{ $member->name }}</span>
                                    </div>
                                </td>
                                <td class="p-4 text-sm text-white/70">{{ $member->email }}</td>
                                <td class="p-4">
                                    <select wire:change="updateMemberRole({{ $member->id }}, $event.target.value)" class="border border-white/20 rounded px-2 py-1 text-sm bg-white/10 focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]" {{ $member->id === auth()->id() ? 'disabled' : '' }}>
                                        <option value="admin" {{ $member->pivot->role == 'admin' ? 'selected' : '' }}>Admin</option>
                                        <option value="member" {{ $member->pivot->role == 'member' ? 'selected' : '' }}>Member</option>
                                        <option value="viewer" {{ $member->pivot->role == 'viewer' ? 'selected' : '' }}>Viewer</option>
                                    </select>
                                </td>
                                <td class="p-4 text-right">
                                    @if($member->id !== auth()->id())
                                        <button wire:click="removeMember({{ $member->id }})" wire:confirm="Are you sure you want to remove this member?" class="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
        
        <!-- Columns Tab -->
        @if($activeTab === 'columns')
            <div class="max-w-2xl">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-medium text-white">Workflow Configuration</h3>
                </div>

                @if (session()->has('column_error'))
                    <div class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm relative" role="alert">
                        <span class="block sm:inline">{{ session('column_error') }}</span>
                    </div>
                @endif
                
                <form wire:submit="addColumn" class="flex gap-2 mb-6">
                    <input type="text" wire:model="newColumnName" placeholder="New Column Name" required class="flex-1 border border-white/20 rounded px-3 py-1.5 text-sm focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] bg-white/10 text-white transition-colors [&>option]:bg-[#1A233A] [&>option]:text-white">
                    <select wire:model="newColumnColor" class="border border-white/20 rounded px-3 py-1.5 text-sm bg-white/10">
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="yellow">Yellow</option>
                        <option value="red">Red</option>
                        <option value="gray">Gray</option>
                    </select>
                    <button type="submit" class="bg-white hover:bg-gray-100 text-[#4C9AFF] font-bold shadow-md hover:-translate-y-0.5 transition-all px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">Add Column</button>
                </form>
                
                <div class="space-y-3">
                    @foreach($columns as $column)
                        <div class="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded shadow-sm hover:shadow transition-shadow">
                            <div class="flex items-center gap-3">
                                <div class="cursor-grab text-[#DFE1E6] hover:text-white/70">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
                                </div>
                                <div class="w-3 h-3 rounded-full" style="background-color: {{ $column->color === 'blue' ? '#0052CC' : ($column->color === 'green' ? '#36B37E' : ($column->color === 'yellow' ? '#FF991F' : '#5E6C84')) }}"></div>
                                <span class="font-medium text-sm text-white">{{ $column->name }}</span>
                            </div>
                            <button wire:click="deleteColumn({{ $column->id }})" wire:confirm="Are you sure?" class="text-white/70 hover:text-red-500 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif
    </div>

    <!-- Invite Member Modal -->
    @if($showInviteModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md" wire:click="$set('showInviteModal', false)"></div>
            <div class="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl w-full max-w-md z-10 flex flex-col overflow-hidden text-white">
                <div class="px-6 py-4 border-b border-white/20 flex justify-between items-center bg-white/5">
                    <h2 class="text-lg font-semibold text-white">Invite Member</h2>
                    <button wire:click="$set('showInviteModal', false)" class="text-white/70 hover:text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div class="p-6">
                    <form wire:submit="inviteMember" class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-white/70 mb-1">Email Address <span class="text-red-500">*</span></label>
                            <input type="email" wire:model="inviteEmail" class="w-full border border-white/20 rounded px-3 py-2 text-sm focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] bg-white/10" required>
                            @error('inviteEmail') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-white/70 mb-1">Role <span class="text-red-500">*</span></label>
                            <select wire:model="inviteRole" class="w-full border border-white/20 rounded px-3 py-2 text-sm focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] bg-white/10" required>
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                                <option value="viewer">Viewer</option>
                            </select>
                            @error('inviteRole') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
                        </div>
                        
                        <div class="flex justify-end gap-3 pt-4 border-t border-white/20 mt-6">
                            <button type="button" wire:click="$set('showInviteModal', false)" class="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded transition-colors">Cancel</button>
                            <button type="submit" class="bg-white hover:bg-gray-100 text-[#4C9AFF] font-bold shadow-md hover:-translate-y-0.5 transition-all px-4 py-2 rounded text-sm font-medium transition-colors shadow-sm">Invite</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    @endif
</div>
