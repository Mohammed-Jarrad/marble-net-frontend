/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				navColor: 'var(--nav-color)',
				mainColor: 'var(--main-color)',
				secondColor: 'var(--second-color)',
				bodyColor: 'var(--body-color)',
				boxColor: 'var(--box-color)',
				whiteColor: 'var(--white-color)',
				blackColor: 'var(--black-color)',
				grayColor: 'var(--gray-color)',
				redColor: 'var(--red-color)',
				greenColor: 'var(--green-color)',
				primary: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					950: '#172554',
				},
			},
			fontFamily: {
				cairo: ['Cairo', 'sans-serif'],
			},
			minHeight: {
				'full-screen': "calc(100vh - 50px)"
			},
			fontSize: {
				'xs': "10px"
			}
		},
	},
	plugins: [],
}
