<script lang="ts">
	//#region Import
	import { onMount } from 'svelte';
	import { isDarkMode } from '../provider/store';
	import { Icon, ArrowRightStartOnRectangle, Moon, Sun } from 'svelte-hero-icons';
	import { deleteDocumentCookie, getDocumentCookie, setDocumentCookie } from '$lib/common/cookie';
	import { clickOutside } from '../provider/click-outside';
	import { goto } from '$app/navigation';
	//#endregion

	// #region property
	export let onClick: (event: MouseEvent) => void;
	export let isMenuOpen: boolean;

	// 쿠키에서 다크 모드 상태를 가져옴
	let storeTheme = getDocumentCookie('theme');
	let isDark = storeTheme === 'DarkTheme';
	let showModal = false;

	// 다크모드 상태를 스토어에 설정
	isDarkMode.set(isDark);

	// 다크모드 상태를 스토어에 설정
	isDarkMode.set(isDark);

	// 다크모드 상태 변경을 구독
	isDarkMode.subscribe((value) => {
		isDark = value;
		toggleDarkMode(isDark);
	});
	// #endregion

	//#region function
	// 다크모드 클래스를 HTML 문서에 추가/제거
	function toggleDarkMode(isDark: boolean) {
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		// 쿠키에 다크모드 상태 저장
		setDocumentCookie('theme', isDark ? 'DarkTheme' : 'LightTheme');
	}

	// 다크모드 상태 토글
	function toggleDarkModeHandler(event: MouseEvent) {
		event.stopPropagation();
		isDarkMode.update((n) => !n);
	}

	function logoutClick(event: MouseEvent) {
		showModal = true;
		isMenuOpen = false; // 메뉴 닫기
		event.stopPropagation();
	}

	function onClickLogoutOk() {
		deleteDocumentCookie('authorization');
		goto('/login');
	}
	//#endregion

	//#region Hook
	// 컴포넌트 마운트 시 다크 모드 초기화
	onMount(() => {
		toggleDarkMode(isDark);
	});
	//#endregion
</script>

<article
	use:clickOutside
	on:click_outside={() => {
		isMenuOpen = false;
	}}
	class="{isMenuOpen ? 'h-48' : 'h-0'} absolute right-0 z-10 overflow-hidden duration-100"
>
	<!-- Menu Item -->
	<div
		class=" z-10 flex items-center justify-center divide-y divide-[#383838] rounded-md border border-gray-300 bg-[#F8F8F8] px-7 shadow-[inset_0_0_2px_#ADACAC] dark:border-[#292929] dark:bg-[#141414] dark:shadow-[inset_0_0_2px_#4B5563]"
	>
		<div>
			<span class="flex w-full items-center justify-center py-3 text-[#3C3C3C] dark:text-[#9D9D9D]">
				version 1.0.0
			</span>

			<hr class="border-[#B9B9B9 w-full border-[0.5px] dark:border-[#5C5C5C]" />

			<div class="flex flex-col items-center space-y-3 py-5">
				<button class="flex items-center text-[#2E2E2E] dark:text-[#DCDCDC]" on:click={logoutClick}>
					로그아웃 <Icon src={ArrowRightStartOnRectangle} class="ml-1 w-4 " />
				</button>

				<label
					class="mr-5 flex cursor-pointer flex-col items-center space-y-1 text-gray-700 dark:text-white"
				>
					<span class="text-[0.6rem] text-gray-500 dark:text-gray-400">Theme</span>
					<div class="ignore-click-outside relative">
						<input
							type="checkbox"
							id="toggle"
							class="sr-only"
							on:click={toggleDarkModeHandler}
							checked={isDark}
						/>
						<div
							class=" h-6 w-[7.1rem] rounded-full bg-[#E8E7E7]
        dark:bg-[#141517]"
						/>
						<div
							class="dot absolute left-0 top-0 flex h-6 items-center rounded-full bg-white transition hover:bg-gray-50 dark:bg-[#26282E]"
						>
							<div
								class="flex max-w-max space-x-1 pl-1 pr-2 text-xs
          text-[#2E2E2E] dark:text-[#B2B4B5]"
							>
								{#if $isDarkMode}
									<Icon src={Moon} class="h-4 w-4" />
									<span>Dark</span>
								{:else}
									<Icon src={Sun} class="h-4 w-4 stroke-2 " />
									<span>Light</span>
								{/if}
							</div>
						</div>
					</div>
				</label>
			</div>
		</div>
	</div>
</article>

<style lang="postcss">
	/* Toggle */
	input:checked ~ .dot {
		transform: translateX(100%);
	}
</style>
