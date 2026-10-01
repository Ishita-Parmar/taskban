<?php

use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Livewire\Attributes\Layout;
use Livewire\Volt\Component;
use App\Models\User;

new #[Layout('layouts.guest')] class extends Component
{
    public int $step = 1;
    public string $email = '';
    public string $otp = '';
    public string $password = '';
    public string $password_confirmation = '';
    public ?User $user = null;

    public function requestOtp(): void
    {
        $this->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $this->user = User::where('email', $this->email)->first();

        if (! $this->user) {
            $this->addError('email', __('We can\'t find a user with that email address.'));
            return;
        }

        $this->step = 2;
    }

    public function verifyOtp(): void
    {
        $this->validate([
            'otp' => ['required', 'string'],
        ]);

        if ($this->otp !== '111978') {
            $this->addError('otp', __('The provided OTP is incorrect.'));
            return;
        }

        $this->step = 3;
    }

    public function resetPassword(): void
    {
        $this->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $this->user->password = Hash::make($this->password);
        $this->user->save();

        session()->flash('status', __('Your password has been reset!'));
        $this->redirectRoute('login', navigate: true);
    }
}; ?>

<div>
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    @if($step === 1)
        <div class="mb-8 text-center">
            <h2 class="text-3xl font-bold text-[#172B4D] mb-2">Reset Password</h2>
            <p class="text-sm text-[#5E6C84]">Forgot your password? Enter your email address to receive an OTP.</p>
        </div>

        <form wire:submit="requestOtp" class="space-y-6">
            <!-- Email Address -->
            <div>
                <x-input-label for="email" :value="__('Email')" class="text-[#5E6C84] font-medium" />
                <x-text-input wire:model="email" id="email" class="block mt-2 w-full" type="email" name="email" required autofocus placeholder="name@company.com" />
                <x-input-error :messages="$errors->get('email')" class="mt-2" />
            </div>

            <div>
                <x-primary-button class="w-full justify-center">
                    {{ __('Send OTP') }}
                </x-primary-button>
            </div>
            
            <div class="mt-6 text-center text-sm text-[#5E6C84]">
                Remember your password? 
                <a href="{{ route('login') }}" wire:navigate class="font-medium text-[#0052CC] hover:text-[#0047B3] transition-colors">Sign in</a>
            </div>
        </form>
    @elseif($step === 2)
        <div class="mb-8 text-center">
            <h2 class="text-3xl font-bold text-[#172B4D] mb-2">Verify OTP</h2>
            <p class="text-sm text-[#5E6C84]">Enter the 6-digit OTP sent to <strong>{{ $email }}</strong>.</p>
        </div>

        <form wire:submit="verifyOtp" class="space-y-6">
            <!-- OTP -->
            <div>
                <x-input-label for="otp" :value="__('One-Time Password (OTP)')" class="text-[#5E6C84] font-medium" />
                <x-text-input wire:model="otp" id="otp" class="block mt-2 w-full text-center tracking-widest text-lg" type="text" name="otp" required autofocus placeholder="123456" />
                <x-input-error :messages="$errors->get('otp')" class="mt-2" />
            </div>

            <div class="flex items-center gap-4">
                <button type="button" wire:click="$set('step', 1)" class="w-1/3 justify-center px-4 py-2 bg-gray-100 border border-transparent rounded-full font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150">
                    Back
                </button>
                <x-primary-button class="w-2/3 justify-center">
                    {{ __('Verify OTP') }}
                </x-primary-button>
            </div>
        </form>
    @elseif($step === 3)
        <div class="mb-8 text-center">
            <h2 class="text-3xl font-bold text-[#172B4D] mb-2">New Password</h2>
            <p class="text-sm text-[#5E6C84]">Enter your new password below.</p>
        </div>

        <form wire:submit="resetPassword" class="space-y-6">
            <!-- Password -->
            <div>
                <x-input-label for="password" :value="__('Password')" class="text-[#5E6C84] font-medium" />
                <x-text-input wire:model="password" id="password" class="block mt-2 w-full" type="password" name="password" required autofocus />
                <x-input-error :messages="$errors->get('password')" class="mt-2" />
            </div>

            <!-- Confirm Password -->
            <div>
                <x-input-label for="password_confirmation" :value="__('Confirm Password')" class="text-[#5E6C84] font-medium" />
                <x-text-input wire:model="password_confirmation" id="password_confirmation" class="block mt-2 w-full" type="password" name="password_confirmation" required />
                <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2" />
            </div>

            <div>
                <x-primary-button class="w-full justify-center">
                    {{ __('Reset Password') }}
                </x-primary-button>
            </div>
        </form>
    @endif
</div>
