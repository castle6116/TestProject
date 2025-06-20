<script lang="ts">
	//#region Import
	import { ChevronDown, Icon } from "svelte-hero-icons";
	import { clickOutside } from "../../../dashboard/provider/click-outside";
	import { createEventDispatcher } from "svelte";
	//#endregion

	//#region Variable
	export let list: string[];
	export let defaultValue: string;
	export let disabled: boolean = false;
	export let width: string = "w-10";
	export let expandedHeight: string = "72px";
	export let collapsedHeight: string = "18px";
	export let dropdownPos: string = "";
	export let arrowPos: string = "top-0 right-0";
	export let textPadding: string = "pl-1";
	export let borderStyle: string = "border-[#35363F]";
	export let backgroundColor: string = "bg-[#1F1F1F]";
	let isExpanded: boolean = false;
	const dispatch = createEventDispatcher();
	//#endregion

	function onClickExpand() {
		isExpanded = !isExpanded;
	}

	function onClickClose() {
		isExpanded = false;
	}

	async function handleSelect(e: any, idx?: number) {
		defaultValue = e!.target.innerText;
		await dispatch("select", { defaultValue, index: idx });
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button
	{disabled}
	use:clickOutside
	on:click={onClickExpand}
	on:click_outside={onClickClose}
	class="z-10 border dark:border-[#35363F] border-[#C3C3C3] rounded-sm dark:text-white text-[#364C55] text-xs transition-all duration-500 ease-in-out overflow-hidden hover:cursor-pointer disabled:hover:cursor-auto disabled:!text-gray-500
			 {width} {dropdownPos} {borderStyle} dark:{backgroundColor} bg-[#F7F6F6]"
	style="height: {isExpanded ? expandedHeight : collapsedHeight};"
>
	<div
		class="flex relative justify-between pr-1 items-center dark:{backgroundColor} bg-[#F7F6F6] {textPadding} "
		style="height: {collapsedHeight};"
	>
		<span class="block w-[80%] text-center">{defaultValue}</span>
		<div class={arrowPos}>
			<Icon src={ChevronDown} class="w-2 h-2" />
		</div>
	</div>
	<ul class="dark:{backgroundColor} bg-[#F7F6F6]">
		{#each list as item, idx}
			<div
				class="cursor-pointer text-center flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-800 dark:{backgroundColor} bg-[#F7F6F6] dark:text-white text-[#364C55]"
				style="height: {collapsedHeight};"
				on:click={async (e) => await handleSelect(e, idx)}
			>
				{item}
			</div>
		{/each}
	</ul>
</button>

<style>
	li {
		list-style-type: none;
		height: 16px;
	}
	.arrow::after {
		position: absolute;
		right: 5px;
		top: 5px;
		content: "";
		width: 5px; /* 사이즈 */
		height: 5px; /* 사이즈 */
		border-top: 1.5px solid #c9c9c9; /* 선 두께 */
		border-right: 1.5px solid #c9c9c9; /* 선 두께 */
		transform: rotate(135deg); /* 각도 */
	}
</style>
