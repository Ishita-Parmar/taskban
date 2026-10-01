<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'TaskBan') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="antialiased font-['Inter',sans-serif] bg-gradient-to-br from-[#0B0F19] via-[#1A233A] to-[#0052CC] text-white min-h-screen flex flex-col selection:bg-[#0052CC] selection:text-white">
        <div class="min-h-screen flex flex-col relative overflow-hidden">
            <!-- Background effects -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#0052CC]/20 blur-[120px]"></div>
                <div class="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#4C9AFF]/10 blur-[100px]"></div>
            </div>

            <div class="relative z-10 flex-1 flex flex-col">
                <livewire:layout.navigation />

                <!-- Page Heading -->
                @if (isset($header))
                    <header class="bg-white/10 border-b border-white/20 backdrop-blur-md shadow mt-6 mx-4 rounded-3xl">
                        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-white">
                            {{ $header }}
                        </div>
                    </header>
                @endif

                <!-- Page Content -->
                <main class="flex-1 pb-12 pt-6">
                    {{ $slot }}
                </main>
            </div>
        </div>
    </body>
</html>
