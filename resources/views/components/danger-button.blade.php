<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center justify-center px-6 py-2.5 bg-red-600 border border-transparent rounded-full font-bold text-sm text-white transition-all duration-300 hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md hover:shadow-lg hover:-translate-y-0.5']) }}>
    {{ $slot }}
</button>
