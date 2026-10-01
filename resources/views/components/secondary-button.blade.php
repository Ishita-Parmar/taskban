<button {{ $attributes->merge(['type' => 'button', 'class' => 'inline-flex items-center px-6 py-3 bg-white border border-[#DFE1E6] rounded-full font-semibold text-sm text-[#172B4D] shadow-sm hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:ring-offset-2 disabled:opacity-25 transition-all duration-200 ease-in-out']) }}>
    {{ $slot }}
</button>
