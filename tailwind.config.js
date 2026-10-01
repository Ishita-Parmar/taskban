/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.js',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    DEFAULT: '#0052CC',
                    hover: '#0047B3',
                },
                surface: {
                    DEFAULT: '#F4F5F7',
                    hover: '#EBECF0',
                },
                slate: {
                    900: '#172B4D',
                    500: '#5E6C84',
                    border: '#DFE1E6',
                },
                status: {
                    success: '#36B37E',
                    warning: '#FF991F',
                    danger: '#FF5630',
                    info: '#4C9AFF',
                }
            }
        },
    },
    plugins: [],
};
