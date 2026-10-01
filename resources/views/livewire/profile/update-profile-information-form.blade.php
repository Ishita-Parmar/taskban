<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;
use Livewire\Volt\Component;

new class extends Component
{
    public string $name = '';
    public string $email = '';

    /**
     * Mount the component.
     */
    public function mount(): void
    {
        $this->name = Auth::user()->name;
        $this->email = Auth::user()->email;
    }

    /**
     * Update the profile information for the currently authenticated user.
     */
    public function updateProfileInformation(): void
    {
        $user = Auth::user();

        $validated = $this->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
        ]);

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        $this->dispatch('profile-updated', name: $user->name);
    }

    /**
     * Send an email verification notification to the current user.
     */
    public function sendVerification(): void
    {
        $user = Auth::user();

        if ($user->hasVerifiedEmail()) {
            $this->redirectIntended(default: route('dashboard', absolute: false));

            return;
        }

        $user->sendEmailVerificationNotification();

        Session::flash('status', 'verification-link-sent');
    }
}; ?>

<section>
    <header>
        <h2 class="text-2xl font-bold text-white">
            {{ __('Profile Information') }}
        </h2>

        <p class="mt-2 text-sm text-white/70">
            {{ __("Update your account's profile information and email address.") }}
        </p>
    </header>

    <form wire:submit="updateProfileInformation" class="mt-8 space-y-6">
        <div>
            <x-input-label for="name" :value="__('Name')" class="text-white/70 font-medium" />
            <x-text-input wire:model="name" id="name" name="name" type="text" class="mt-2 block w-full bg-white/10 text-white border border-white/20 focus:border-[#4C9AFF] focus:ring-[#4C9AFF]" required autofocus autocomplete="name" />
            <x-input-error class="mt-2" :messages="$errors->get('name')" />
        </div>

        <div>
            <x-input-label for="email" :value="__('Email')" class="text-white/70 font-medium" />
            <x-text-input wire:model="email" id="email" name="email" type="email" class="mt-2 block w-full bg-white/10 text-white border border-white/20 focus:border-[#4C9AFF] focus:ring-[#4C9AFF]" required autocomplete="username" />
            <x-input-error class="mt-2" :messages="$errors->get('email')" />

            @if (auth()->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! auth()->user()->hasVerifiedEmail())
                <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p class="text-sm font-medium text-yellow-800">
                        {{ __('Your email address is unverified.') }}

                        <button wire:click.prevent="sendVerification" class="ml-2 underline text-sm text-yellow-700 hover:text-yellow-900 focus:outline-none transition-colors">
                            {{ __('Click here to re-send the verification email.') }}
                        </button>
                    </p>

                    @if (session('status') === 'verification-link-sent')
                        <p class="mt-3 font-medium text-sm text-green-600">
                            {{ __('A new verification link has been sent to your email address.') }}
                        </p>
                    @endif
                </div>
            @endif
        </div>

        <div class="flex items-center gap-4 pt-4">
            <button type="submit" class="bg-white hover:bg-gray-100 text-[#0052CC] font-bold shadow-md hover:-translate-y-0.5 transition-all px-8 py-2.5 rounded-full text-sm">{{ __('Save Changes') }}</button>

            <x-action-message class="me-3 text-green-400 font-medium flex items-center gap-1" on="profile-updated">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                {{ __('Saved successfully.') }}
            </x-action-message>
        </div>
    </form>
</section>

