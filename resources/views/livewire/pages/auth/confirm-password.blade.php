<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Livewire\Attributes\Layout;
use Livewire\Volt\Component;

new #[Layout('layouts.guest')] class extends Component
{
    public string $password = '';

    /**
     * Confirm the current user's password.
     */
    public function confirmPassword(): void
    {
        $this->validate([
            'password' => ['required', 'string'],
        ]);

        if (! Auth::guard('web')->validate([
            'email' => Auth::user()->email,
            'password' => $this->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        session(['auth.password_confirmed_at' => time()]);

        $this->redirectIntended(default: route('dashboard', absolute: false), navigate: true);
    }
}; ?>

<div>
    <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-[#172B4D] mb-2">Security Confirmation</h2>
        <p class="text-sm text-[#5E6C84]">This is a secure area of the application. Please confirm your password before continuing.</p>
    </div>

    <form wire:submit="confirmPassword" class="space-y-6">
        <!-- Password -->
        <div>
            <x-input-label for="password" :value="__('Password')" class="text-[#5E6C84] font-medium" />

            <x-text-input wire:model="password"
                          id="password"
                          class="block mt-2 w-full"
                          type="password"
                          name="password"
                          required autocomplete="current-password" placeholder="••••••••" />

            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <div>
            <x-primary-button class="w-full justify-center">
                {{ __('Confirm Password') }}
            </x-primary-button>
        </div>
    </form>
</div>
