<script lang="ts">
	// #region Import
	import Header from './header/+page.svelte';
	import { isDarkMode } from './provider/store';
	import Slidemenu from './slidemenu/+page.svelte';
	//#endregion

	export let workshopId: string;
	export let lineId: string;
	export let opCode: string;
	export let currentRoute: number;
</script>

<div
	class=" bg-[#F8F8F8] text-[#344A53] dark:bg-[#0E0E0E] dark:text-white"
	style={$isDarkMode
		? '--cheack-legend-color:#888888; --legend-color:white'
		: '--cheack-legend-color:#8C8C8C;--legend-color:#344A53'}
>
	<!-- Slidemenu -->
	<Slidemenu bind:currentRoute />
	<!-- Main Page -->
	<div class="ml-24 flex h-screen flex-col px-3">
		<Header {workshopId} {lineId} {opCode} />
		<!-- Content -->
		<div class="flex-grow p-4">
			<slot />
		</div>
		<!-- Footer -->
		<div class="text-center text-xs font-thin text-[#9D9D9D]">Copyright © 2024 RoyLabs.</div>
	</div>
</div>
