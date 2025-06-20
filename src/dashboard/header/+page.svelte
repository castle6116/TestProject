<script lang="ts">
	//#region inport
	import { Icon, Bars4, EllipsisVertical } from 'svelte-hero-icons';
	import { isDarkMode, isSlideMenuOpen } from '../provider/store';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import DropdownMenu from './DropdownMenu.svelte';
	//#endregion

	//#region global variable
	let currentPage = '';
	let impormationTitle = ['공장', '라인', '공정'];

	//SlideMenu
	const toggle = () => {
		$isSlideMenuOpen = !$isSlideMenuOpen;
	};

	export let workshopId: string;
	export let lineId: string;
	export let opCode: string;
	let isMenuOpen = false;
	//#region

	// Thema 새로고침시 테마 유지
	onMount(() => {
		const isDarkModeLocalStorage = localStorage.getItem('isDarkMode');

		if (isDarkModeLocalStorage === 'true') {
			document.documentElement.classList.add('dark');
		}
	});

	// 현재 페이지 정보 조회
	onMount(() => {
		const routeId: string | null = $page.route.id;
		let routeIds: string[] = [];
		if (routeId) {
			routeIds = routeId.split('/');
		}
		const currentPageTemp: string | undefined = routeIds.pop();
		if (currentPageTemp) {
			currentPage = currentPageTemp.toUpperCase();
		}
	});

	//#endregion

	//#region funtion
	// 메뉴 토글
	function toggleMenu(event: MouseEvent) {
		isMenuOpen = !isMenuOpen;
		event.stopPropagation();
	}
	//#endregion
</script>

<header class="relative flex justify-between py-1.5">
	<div class="flex flex-row items-center space-x-2">
		<!-- Menu Toggle Btn -->
		<div on:click={toggle} on:keypress={toggle} role="presentation" class="flex items-center">
			<Icon src={Bars4} class="h-7 w-7 cursor-pointer 2xl:ml-4 2xl:h-8 2xl:w-8 " />
		</div>

		<!-- Router Text Content -->
		<div class="font-medium 2xl:text-lg">
			{currentPage != 'STANDARD' ? currentPage : '공구관리'}
		</div>
	</div>

	<!-- Immpormation -->
	<div class="flex-rows flex space-x-5 pr-2">
		{#each impormationTitle as Title, index}
			<div class="flex flex-col">
				<p class="text-[0.8rem] text-[#646464] dark:text-[#B4B4B4]">{Title}</p>
				<p class="text-sm">{index == 0 ? workshopId : index == 1 ? lineId : opCode}</p>
			</div>
			<div
				class={index === impormationTitle.length - 1
					? 'hidden'
					: $isDarkMode
						? 'gradient-line'
						: 'light-gradient-line'}
			/>
		{/each}
		<!-- Btn -->
		<div
			class=" ignore-click-outside rounded border border-[#CACACA] bg-[#F8F8F8] shadow-[inset_0_0_2px_#ADACAC] dark:border-[#35363e] dark:bg-[#1f1f1f] dark:shadow-[inset_0_0_2px_#4B5563]"
			on:click={toggleMenu}
			role="presentation"
		>
			<Icon src={EllipsisVertical} class="w-6" />
		</div>
	</div>
</header>

<div class="relative">
	<DropdownMenu onClick={() => {}} bind:isMenuOpen />
</div>

<style lang="postcss">
	.gradient-line {
		@apply h-10 w-1;
		background-image: radial-gradient(
			farthest-side,
			transparent 10%,
			#ffffff -50px,
			transparent 80%
		);
	}

	.light-gradient-line {
		@apply h-10 w-[0.14rem];
		background-image: radial-gradient(
			farthest-side,
			transparent 10%,
			#282828 -50px,
			transparent 80%
		);
	}
</style>
