<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0052CC] to-[#2684FF] border border-transparent rounded-full font-semibold text-sm text-white tracking-wide hover:shadow-lg hover:-translate-y-0.5 focus:bg-[#0047B3] active:bg-[#003B99] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:ring-offset-2 transition-all duration-200 ease-in-out']) }}>
    {{ $slot }}
</button>
