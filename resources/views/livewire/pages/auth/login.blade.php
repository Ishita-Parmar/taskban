<?php

use App\Livewire\Forms\LoginForm;
use Illuminate\Support\Facades\Session;
use Livewire\Attributes\Layout;
use Livewire\Volt\Component;

new #[Layout('layouts.guest')] class extends Component
{
    public LoginForm $form;

    /**
     * Handle an incoming authentication request.
     */
    public function login(): void
    {
        $this->validate();

        $this->form->authenticate();

        Session::regenerate();

        $this->redirectIntended(default: route('dashboard', absolute: false), navigate: true);
    }
}; ?>

<div>
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-[#172B4D] mb-2">Welcome back</h2>
        <p class="text-sm text-[#5E6C84]">Please enter your details to sign in.</p>
    </div>

    <form wire:submit="login" class="space-y-6">
        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('Email')" class="text-[#5E6C84] font-medium" />
            <x-text-input wire:model="form.email" id="email" class="block mt-2 w-full" type="email" name="email" required autofocus autocomplete="username" placeholder="name@company.com" />
            <x-input-error :messages="$errors->get('form.email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div>
            <div class="flex justify-between items-center">
                <x-input-label for="password" :value="__('Password')" class="text-[#5E6C84] font-medium" />
                @if (Route::has('password.request'))
                    <a class="text-sm font-medium text-[#0052CC] hover:text-[#0047B3] transition-colors" href="{{ route('password.request') }}" wire:navigate>
                        {{ __('Forgot password?') }}
                    </a>
                @endif
            </div>

            <x-text-input wire:model="form.password" id="password" class="block mt-2 w-full"
                            type="password"
                            name="password"
                            required autocomplete="current-password" placeholder="••••••••" />

            <x-input-error :messages="$errors->get('form.password')" class="mt-2" />
        </div>

        <!-- Remember Me -->
        <div class="block">
            <label for="remember" class="inline-flex items-center group cursor-pointer">
                <input wire:model="form.remember" id="remember" type="checkbox" class="rounded border-[#DFE1E6] text-[#0052CC] shadow-sm focus:ring-[#0052CC] transition-colors cursor-pointer" name="remember">
                <span class="ms-3 text-sm text-[#5E6C84] group-hover:text-[#172B4D] transition-colors">{{ __('Remember me for 30 days') }}</span>
            </label>
        </div>

        <div>
            <x-primary-button class="w-full justify-center">
                {{ __('Sign in') }}
            </x-primary-button>
        </div>
        
        <div class="mt-6 text-center text-sm text-[#5E6C84]">
            Don't have an account? 
            <a href="{{ route('register') }}" wire:navigate class="font-medium text-[#0052CC] hover:text-[#0047B3] transition-colors">Sign up</a>
        </div>
    </form>
</div>

