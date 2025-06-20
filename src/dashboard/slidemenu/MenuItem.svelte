<script lang="ts">
	//#region Import
	import { Icon } from 'svelte-hero-icons';
	import { isSlideMenuOpen } from '../provider/store';
	import { page } from '$app/stores';
	// menuitem data
	import menuitem from './menuitem';
	import { isClickMenu } from './store';
	//#endregion

	export let currentRoute: number;
	//#region Variable
	const style = {
		title: `mx-4 text-[18px] ml-5 2xl:text-lg`,
		link: `flex items-center `,
		close: `lg:invisible opacity-0 lg:transition-all`,
		open: `lg:ease-in lg:h-auto lg:opacity-100 lg:transition-all`
	};
	//#endregion

	let subMenuHeight: Array<number> = menuitem.map((item) => {
		return item.subMenu.length * 40;
	});

	$isClickMenu[currentRoute] = true;
	//#endregion
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="mt-5">
	<ul class="space-y-6">
		{#each menuitem as item, index}
			<li class="cursor-pointer">
				<!-- Title -->
				<div
					class="{style.link}	
					<!-- 현재 페이지와 메뉴가 일치하면 Checked 색상 변경 -->
					{$page.route.id?.includes(item.title)
						? 'border-[#5c5cd1] border-l-[3.5] text-[#5c5cd1]'
						: 'border-transparent text-gray-500'} 
						{$isSlideMenuOpen ? 'pl-3' : 'pl-0'} border-l-[3.5px] duration-300"
					on:click={() => {
						// 메뉴 클릭 시, 해당 메뉴가 닫혀있으면 메뉴 Open
						if ($isClickMenu[index] == false) {
							$isClickMenu[index] = true;
							return;
						}

						// 메뉴 클릭 시, 해당 메뉴가 열려있으면 메뉴 Close
						if ($isClickMenu[index] == true) {
							$isClickMenu[index] = false;
							return;
						}
					}}
				>
					<!-- Icon -->
					<div
						class="<!--
						현재 페이지와 메뉴가 일치하면 아이콘 색상 변경 --> p-2
						{$page.route.id?.includes(item.title) || $isClickMenu[index] ? 'text-[#5c5cd1]' : 'text-gray-500'}"
					>
						<Icon class="h-8 w-8 2xl:h-10 2xl:w-10" src={item.icon} />
					</div>

					<!-- Slide Menu Open 시 Title Toggle 기능 -->
					<div class=" w-full items-center">
						<!-- Arrow Icon -->
						<span
							class="{style.title} {$isSlideMenuOpen
								? 'block h-full w-24'
								: 'hidden h-0 w-0'} duration-300
								{$isClickMenu[index] && 'text-[#5c5cd1]'}
								w-full
								"
						>
							{item.title}
						</span>
					</div>
				</div>

				{#if item.subMenu}
					<div
						class="flex flex-col items-center overflow-hidden duration-300"
						style="height: {$isClickMenu[index] ? subMenuHeight[index] : 0}px"
					>
						{#each item.subMenu as subMenu}
							<a
								href={subMenu.link}
								class="flex h-10 w-full items-center justify-center bg-[#F3F3F3] text-xs text-[#707070] hover:bg-gray-200 dark:bg-[#001A38] dark:text-white dark:hover:bg-gray-800"
								on:click={() => {
									$isSlideMenuOpen = false;
								}}
							>
								{subMenu.title}
							</a>
						{/each}
					</div>
				{/if}
			</li>
		{/each}
	</ul>
</div>
