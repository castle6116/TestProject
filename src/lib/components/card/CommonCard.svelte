<script lang="ts">
	// #region Import
	import { Icon, Bars3, type IconSource } from "svelte-hero-icons";
	import { isDarkMode } from "../../../dashboard/provider/store";
	// #endregion

	// #region State
	// title
	export let caption: string;
	// ModalBtn 클릭 이벤트 처리기
	export let onClick: (() => void) | undefined | null = null;
	// style
	export let style: string = "";
	// Modal 버튼 표시 여부
	export let isModalBtn: boolean = false;
	// Error Effect 표시 여부
	export let isErrorEffect: boolean = false;
	// Title 배경 색상 설정
	export let titleBackground: string =
		"radial-gradient(circle, rgba(45,48,52,0.7399553571428572) 4%, rgba(20,21,23,0) 50%, rgba(20,21,23,0) 100%)";

	export let contentBackgroundColor: string = "bg-inherit";

	export let titleBackgroundLight: string =
		"radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(240,244,255,0.9668461134453782) 100%);";
	export let buttonIcon: IconSource | string = Bars3;

	export let borderStyle: string = "shadow-[inset_0_0_10px_#4B5563]";

	export let leftSideButton: boolean = false;
	export let leftSideButtonDisabled: boolean = true;
	export let leftSideButtonCaption: string = "순서 변경";
	export let leftSideButtonSize: string = "w-14 h-6";
	export let onClickLeftSideButton: (() => void) | undefined = undefined;
	// #endregion
</script>

<article
	class="{style}  h-full rounded-xl bg-white dark:bg-[#141517] flex flex-col overflow-hidden relative"
>
	<!-- Error Effect, Shadow -->
	<div
		class="absolute h-full w-full rounded-xl {isErrorEffect
			? 'shadow-[inset_0_0_18px_#ff0000] animate-errorpulse'
			: $isDarkMode
				? borderStyle
				: 'shadow-[inset_0_0_10px_#D9D9D9]'}"
	></div>
	<!-- Title Error Effect -->
	<div
		class="py-2.5 dark:border-none {isErrorEffect
			? 'animate-errorpulse'
			: $isDarkMode
				? ''
				: 'border-b border-[#D7D7D7]'}"
		style={isErrorEffect
			? "background: radial-gradient(circle, rgba(255,0,0,0.5242690826330532) 0%, rgba(255,0,0,0.1012998949579832) 100%)"
			: $isDarkMode
				? `background: ${titleBackground}`
				: `background: ${titleBackgroundLight}`}
	>
		<div class="relative flex w-full items-center justify-center flex-row">
			<!-- Title -->
			{#if leftSideButton}
				<button
					disabled={leftSideButtonDisabled}
					on:click={onClickLeftSideButton}
					class="{leftSideButtonSize}
					absolute bg-green-600 text-white left-5 top-0.5 rounded-md text-xs cursor-pointer disabled:cursor-auto disabled:bg-[#F8F8F8] disabled:text-[#364C55] dark:disabled:border-[#35363e] dark:disabled:text-white dark:disabled:bg-[#1f1f1f] hover:bg-green-700 duration-150"
				>
					{leftSideButtonCaption}
				</button>
			{/if}
			<p class="text-black dark:text-white text-base font-medium w-full items-center text-center">
				{caption}
			</p>
			<!-- Modal Btn -->
			<button
				class="{isModalBtn
					? 'block'
					: 'hidden'} absolute right-5 border rounded bg-[#F8F8F8] dark:bg-[#1f1f1f] dark:border-[#35363e] border-[#CACACA]"
				on:click={onClick}
			>
				{#if typeof buttonIcon === "string"}
					<img class="w-4 py-1 mx-1" src={buttonIcon} alt="button" />
				{:else}
					<Icon src={buttonIcon} class="w-5 mx-2" />
				{/if}
			</button>
		</div>
	</div>
	<!-- Content 영역 -->
	<div
		class="relative h-full w-full overflow-hidden flex items-center justify-center pb-2"
		style="background: {contentBackgroundColor};"
	>
		<slot />
	</div>
</article>

<style lang="postcss">
	.error-effect {
		background: radial-gradient(
			circle,
			rgba(255, 0, 0, 0.5242690826330532) 0%,
			rgba(255, 0, 0, 0.1012998949579832) 100%
		);
	}
</style>
