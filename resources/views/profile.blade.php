<x-app-layout>
    <x-slot name="header">
        <h2 class="font-extrabold text-3xl text-white leading-tight drop-shadow-md">
            {{ __('Profile Settings') }}
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Column 1 -->
                <div class="space-y-8">
                    <div class="p-8 bg-white/10 backdrop-blur-xl shadow-xl border border-white/20 rounded-3xl hover:shadow-2xl hover:border-white/40 transition-all duration-300 relative group">
                        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                        <div class="max-w-xl relative z-10 text-white [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:focus:border-[#4C9AFF] [&_input]:focus:bg-white/20 [&_label]:text-white/90 [&_p]:text-white/70">
                            <livewire:profile.update-profile-information-form />
                        </div>
                    </div>

                    <div class="p-8 bg-white/10 backdrop-blur-xl shadow-xl border border-white/20 rounded-3xl hover:shadow-2xl hover:border-white/40 transition-all duration-300 relative group">
                        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                        <div class="max-w-xl relative z-10 text-white [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:focus:border-red-400 [&_input]:focus:bg-white/20 [&_label]:text-white/90 [&_p]:text-white/70 [&_h2]:text-white">
                            <livewire:profile.delete-user-form />
                        </div>
                    </div>
                </div>

                <!-- Column 2 -->
                <div class="space-y-8">
                    <div class="p-8 bg-white/10 backdrop-blur-xl shadow-xl border border-white/20 rounded-3xl hover:shadow-2xl hover:border-white/40 transition-all duration-300 relative group">
                        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                        <div class="max-w-xl relative z-10 text-white [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:focus:border-[#4C9AFF] [&_input]:focus:bg-white/20 [&_label]:text-white/90 [&_p]:text-white/70 [&_h2]:text-white">
                            <livewire:profile.update-password-form />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
