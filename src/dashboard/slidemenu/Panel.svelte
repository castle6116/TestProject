<script lang="ts">
	import { onMount } from 'svelte';

	//#region Import
	import { isSlideMenuOpen, isDarkMode } from '../provider/store';
	import { Icon, Cog8Tooth, ArrowRightStartOnRectangle, Moon, Sun } from 'svelte-hero-icons';

	import { getDocumentCookie, setDocumentCookie } from '$lib/common/cookie';
	//#endregion

	// 쿠키에서 다크 모드 상태를 가져옴
	let storeTheme = getDocumentCookie('theme');
	let isDark = storeTheme === 'DarkTheme';

	// 다크모드 상태를 스토어에 설정
	isDarkMode.set(isDark);

	// 다크모드 상태를 스토어에 설정
	isDarkMode.set(isDark);

	// 다크모드 상태 변경을 구독
	isDarkMode.subscribe((value) => {
		isDark = value;
		toggleDarkMode(isDark);
	});

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
	function toggleDarkModeHandler() {
		isDarkMode.update((n) => !n);
	}

	// 컴포넌트 마운트 시 다크 모드 초기화
	onMount(() => {
		toggleDarkMode(isDark);
	});
</script>

<div
	class="bg-[#F8F8F8] border-gray-300 dark:bg-[#111110] mx-4 flex flex-col items-center border dark:border-[#292929] rounded-md py-4 px-2 space-y-5 text-sm min-w-28 {$isSlideMenuOpen
		? 'block'
		: 'hidden'}"
>
	<span class="text-[#3C3C3C] dark:text-[#9D9D9D]">
		최신버전 사용 중 <br />
		version 1.0.0
	</span>

	<hr class="w-full border-[#B9B9B9 dark:border-[#5C5C5C] border-[0.5px]" />

	<div class="flex flex-col space-y-3 items-center">
		<button class="flex items-center dark:text-[#5c5c5c] text-[#9D9D9D]">
			설정 <Icon src={Cog8Tooth} class="ml-1 w-4 h-4" />
		</button>
		<button class="flex items-center text-[#2E2E2E] dark:text-[#DCDCDC]">
			로그아웃 <Icon src={ArrowRightStartOnRectangle} class="ml-1 w-4 " />
		</button>

		<!-- Theme Btn -->
		<label for="toggle" class="mr-5 flex cursor-pointer text-gray-700 dark:text-white">
			<div class="relative">
				<!-- Thema toggle 기능 -->
				<input
					type="checkbox"
					id="toggle"
					class="sr-only"
					on:click={toggleDarkModeHandler}
					checked={isDark}
				/>
				<!-- 배경색 -->
				<div
					class=" h-6 w-[7.1rem] rounded-full bg-[#E8E7E7]
					dark:bg-[#141517]"
				/>
				<!-- dot -->
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

<style lang="postcss">
	/* Toggle */
	input:checked ~ .dot {
		transform: translateX(100%);
	}
</style>
