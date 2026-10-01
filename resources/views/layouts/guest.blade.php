<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans text-gray-900 antialiased">
        <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-[#0052CC] to-[#4C9AFF]">
            <div>
                <a href="/" wire:navigate class="flex flex-col items-center gap-2">
                    <x-application-logo class="w-16 h-16 fill-current text-white drop-shadow-md" />
                    <span class="text-white text-2xl font-bold tracking-tight drop-shadow-md">TaskBan</span>
                </a>
            </div>

            <div class="w-full sm:max-w-md mt-8 px-10 py-12 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden sm:rounded-3xl border border-white/20 transition-all duration-300 hover:shadow-3xl">
                {{ $slot }}
            </div>
        </div>
    </body>
</html>
