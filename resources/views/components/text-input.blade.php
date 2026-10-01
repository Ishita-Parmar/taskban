@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->merge(['class' => 'border-[#DFE1E6] focus:border-[#0052CC] focus:ring-[#0052CC] rounded-xl shadow-sm transition-all duration-200 px-4 py-2.5 bg-gray-50 focus:bg-white text-[#172B4D] placeholder-gray-400']) }}>
