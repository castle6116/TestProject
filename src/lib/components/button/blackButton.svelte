<script lang="ts">
	import RefreshIcon from '$assets/images/refresh.png';
	import LRefreshIcon from '$assets/images/light_refresh.png';
	import { isDarkMode } from '../../../dashboard/provider/store';

	export let onClick: () => void;
	export let pos: string = '';
	export let width: string = 'w-8';
	export let height: string = 'h-[18px]';
</script>

<button
	on:click={onClick}
	class="absolute top-[2px] z-10 overflow-hidden rounded-sm border-[1px] border-[#C3C3C3] bg-[#F7F6F6] text-xs dark:border-[#35363F] dark:bg-[#1F1F1F]
  {pos} {width} {height}"
>
	{#if $isDarkMode}
		<img src={RefreshIcon} class="h-full w-full object-contain" alt="btnImg" />
	{:else}
		<img src={LRefreshIcon} class="h-full w-full object-contain" alt="btnImg" />
	{/if}
</button>
