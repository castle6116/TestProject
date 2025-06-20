/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		// './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			animation: {
				spin: "spin 4s linear infinite",
				loading: "spin 1.5s linear infinite",
				errorpulse: "pulse 0.7s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				toolerrorpulse: "pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				toolwarningpulse: "pulse 0.9s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
			screens: {
				pc: "1920px",
			},
		},
	},
	// plugins: [require('flowbite/plugin')],
	plugins: [],
	darkMode: "class",
};
