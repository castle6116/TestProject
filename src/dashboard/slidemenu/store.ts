import { writable, type Writable } from 'svelte/store';
import menuitem from './menuitem';

export let isClickMenu: Writable<Array<boolean>> = writable(menuitem.map(() => false));
