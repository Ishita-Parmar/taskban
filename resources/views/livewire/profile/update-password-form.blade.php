<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Livewire\Volt\Component;

new class extends Component
{
    public string $current_password = '';
    public string $password = '';
    public string $password_confirmation = '';

    /**
     * Update the password for the currently authenticated user.
     */
    public function updatePassword(): void
    {
        try {
            $validated = $this->validate([
                'current_password' => ['required', 'string', 'current_password'],
                'password' => ['required', 'string', Password::defaults(), 'confirmed'],
            ]);
        } catch (ValidationException $e) {
            $this->reset('current_password', 'password', 'password_confirmation');

            throw $e;
        }

        Auth::user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        $this->reset('current_password', 'password', 'password_confirmation');

        $this->dispatch('password-updated');
    }
}; ?>

<section>
    <header>
        <h2 class="text-2xl font-bold text-white">
            {{ __('Update Password') }}
        </h2>

        <p class="mt-2 text-sm text-white/70">
            {{ __('Ensure your account is using a long, random password to stay secure.') }}
        </p>
    </header>

    <form wire:submit="updatePassword" class="mt-8 space-y-6">
        <div>
            <x-input-label for="update_password_current_password" :value="__('Current Password')" class="text-white/70 font-medium" />
            <x-text-input wire:model="current_password" id="update_password_current_password" name="current_password" type="password" class="mt-2 block w-full bg-white/10 text-white border border-white/20 focus:border-[#4C9AFF] focus:ring-[#4C9AFF]" autocomplete="current-password" placeholder="••••••••" />
            <x-input-error :messages="$errors->get('current_password')" class="mt-2" />
        </div>

        <div>
            <x-input-label for="update_password_password" :value="__('New Password')" class="text-white/70 font-medium" />
            <x-text-input wire:model="password" id="update_password_password" name="password" type="password" class="mt-2 block w-full bg-white/10 text-white border border-white/20 focus:border-[#4C9AFF] focus:ring-[#4C9AFF]" autocomplete="new-password" placeholder="••••••••" />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <div>
            <x-input-label for="update_password_password_confirmation" :value="__('Confirm Password')" class="text-white/70 font-medium" />
            <x-text-input wire:model="password_confirmation" id="update_password_password_confirmation" name="password_confirmation" type="password" class="mt-2 block w-full bg-white/10 text-white border border-white/20 focus:border-[#4C9AFF] focus:ring-[#4C9AFF]" autocomplete="new-password" placeholder="••••••••" />
            <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2" />
        </div>

        <div class="flex items-center gap-4 pt-4">
            <button type="submit" class="bg-white hover:bg-gray-100 text-[#0052CC] font-bold shadow-md hover:-translate-y-0.5 transition-all px-8 py-2.5 rounded-full text-sm">{{ __('Save Password') }}</button>

            <x-action-message class="me-3 text-green-400 font-medium flex items-center gap-1" on="password-updated">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                {{ __('Saved successfully.') }}
            </x-action-message>
        </div>
    </form>
</section>
