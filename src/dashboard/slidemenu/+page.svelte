<script lang="ts">
	//#region Import
	import { clickOutside } from '../provider/click-outside';
	import { isSlideMenuOpen } from '../provider/store';
	import MenuItem from './MenuItem.svelte';
	import Logo from './Logo.svelte';

	export let currentRoute: number;
	//#region Variable_Stayle
	const style = {
		close: `duration-[600ms] w-24`,
		open: `duration-300 w-52 2xl:w-64`
	};
	// #endregion

	//#region Event Listener _ (전역) 메뉴 바깥영역 클릭했을때 Closer 기능
	const closeSidenav = () => {
		//close sidenav on click outside when viewport is less than 1024px
		$isSlideMenuOpen = false;
	};
	//#endregion
</script>

<div
	use:clickOutside
	on:click_outside={closeSidenav}
	class="absolute top-0 z-40 h-screen {$isSlideMenuOpen ? style.open : style.close}"
>
	<div
		class="flex h-full flex-col items-center justify-center border-r border-[#E5E6E7] bg-white dark:border-[#2C2828] dark:bg-[#0E0D0D]"
	>
		<Logo />
		<div class="mb-8 flex h-full w-full flex-col justify-between">
			<MenuItem bind:currentRoute />
		</div>
	</div>
</div>

<style>
	/* Chrom or Opera 브라우저에서 나타나는 Scrollbar 없애는 Webkit Browser Css */
	.scrollbar::-webkit-scrollbar {
		width: 0;
		background: transparent;
	}
	.scrollbar {
		-ms-overflow-style: none;
	}
</style>
