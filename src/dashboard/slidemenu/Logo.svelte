<script lang="ts">
	//#region Import
	import { isSlideMenuOpen, isDarkMode } from '../provider/store';
	import Simbol from '$assets/images/Simbol.png';
	import LSimbol from '$assets/images/light_simbol.png';
	import SimbolLogo from '$assets/images/simbol_logo.png';
	import LSimbolLogo from '$assets/images/light_simbol_logo.png';
	//#endregion
</script>

<div class="flex items-center justify-center duration-300 py-12">
	{#if $isSlideMenuOpen}
		<!-- Slide Menu_Open Logo -->
		{#if $isDarkMode}
			<img src={SimbolLogo} class="h-8" alt="Enoch Ndika" />
		{:else}
			<img src={LSimbolLogo} class="h-8" alt="Enoch Ndika" />
		{/if}
	{:else}
		<!-- Slide Menu_Close Logo -->
		{#if $isDarkMode}
			<img src={Simbol} class="h-8" alt="Enoch Ndika" />
		{:else}
			<img src={LSimbol} class="h-8" alt="Enoch Ndika" />
		{/if}
	{/if}
</div>
