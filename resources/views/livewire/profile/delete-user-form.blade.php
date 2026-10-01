<?php

use App\Livewire\Actions\Logout;
use Illuminate\Support\Facades\Auth;
use Livewire\Volt\Component;

new class extends Component
{
    public string $password = '';

    /**
     * Delete the currently authenticated user.
     */
    public function deleteUser(Logout $logout): void
    {
        $this->validate([
            'password' => ['required', 'string', 'current_password'],
        ]);

        tap(Auth::user(), $logout(...))->delete();

        $this->redirect('/', navigate: true);
    }
}; ?>

<section class="space-y-6">
    <header>
        <h2 class="text-2xl font-bold text-red-600">
            {{ __('Delete Account') }}
        </h2>

        <p class="mt-2 text-sm text-white/70">
            {{ __('Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.') }}
        </p>
    </header>

    <button type="button" x-data="" x-on:click.prevent="$dispatch(\'open-modal\', \'confirm-user-deletion\')" class="bg-red-500 hover:bg-red-600 text-white font-bold shadow-md hover:-translate-y-0.5 transition-all px-8 py-2.5 rounded-full text-sm">{{ __('Delete Account') }}</button>

    <x-modal name="confirm-user-deletion" :show="$errors->isNotEmpty()" focusable>
        <form wire:submit="deleteUser" class="p-8">

            <h2 class="text-xl font-bold text-white">
                {{ __('Are you sure you want to delete your account?') }}
            </h2>

            <p class="mt-3 text-sm text-white/70 bg-red-50 border border-red-100 p-4 rounded-xl">
                {{ __('Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.') }}
            </p>

            <div class="mt-6">
                <x-input-label for="password" value="{{ __('Password') }}" class="sr-only" />

                <x-text-input
                    wire:model="password"
                    id="password"
                    name="password"
                    type="password"
                    class="mt-1 block w-3/4 bg-white/10 text-white border border-white/20 focus:border-[#4C9AFF] focus:ring-[#4C9AFF]"
                    placeholder="{{ __('Password') }}"
                />

                <x-input-error :messages="$errors->get('password')" class="mt-2" />
            </div>

            <div class="mt-8 flex justify-end gap-3">
                <button type="button" class="bg-white/10 hover:bg-white/20 text-white font-bold shadow-md hover:-translate-y-0.5 transition-all px-8 py-2.5 rounded-full text-sm" x-on:click="$dispatch(\'close\')">{{ __('Cancel') }}</button>

                <button type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold shadow-md hover:-translate-y-0.5 transition-all px-8 py-2.5 rounded-full text-sm ">{{ __('Delete Account') }}</button>
            </div>
        </form>
    </x-modal>
</section>
