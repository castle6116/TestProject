import { writable, type Writable } from 'svelte/store';

const isSlideMenuOpen = writable(false);

const isDarkMode: Writable<boolean> = writable(true);

export { isSlideMenuOpen, isDarkMode };
