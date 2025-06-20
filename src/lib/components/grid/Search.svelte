<script lang="ts">
	import { Icon, MagnifyingGlass } from "svelte-hero-icons";
	import type { Filter, Tabulator } from "tabulator-tables";

	export let dataGrid: Tabulator;
	export let showModal: boolean;
	export let currentFilter: string;
	export let filterCategory: string;
	export let isRefresh: boolean = false;

	export let value = "";
	let tempFilters: Filter[] = [];

	// 모달 닫힐 때 검색어 초기화
	$: if (!showModal) value = "";

	$: if (isRefresh) {
		value = "";
		isRefresh = false;
	}

	// 처음 로드 시 Filter 설정
	$: {
		if (dataGrid && currentFilter) {
			const filterIdx = tempFilters.findIndex((t) => t.field == filterCategory);

			if (filterIdx >= 0) {
				if (tempFilters.length == 2) {
					tempFilters = [
						tempFilters[filterIdx == 0 ? 1 : 0],
						{
							field: filterCategory,
							type: "=",
							value: currentFilter,
						},
					];
				} else {
					tempFilters = [
						{
							field: filterCategory,
							type: "=",
							value: currentFilter,
						},
					];
				}
			} else {
				tempFilters.push({
					field: filterCategory,
					type: "=",
					value: currentFilter,
				});
			}
			dataGrid?.setFilter(tempFilters);
		}
	}

	function customFilter(data: any, filterParams: string) {
		var match = false;

		// 검색 필터
		for (var key in data) {
			if (data[key] === undefined) continue;

			if (typeof filterParams == "string") filterParams = filterParams.toUpperCase();
			// 검색 조건과 일치하는 데이터가 있으면 match를 true로 변경
			if (JSON.stringify(data[key]).toUpperCase().search(filterParams) != -1) {
				match = true;
			}
		}

		if (currentFilter === "전체") return match;
		if (data[filterCategory] !== currentFilter) return false;

		return match;
	}
</script>

<div
	class="bg-[#F7F6F6] dark:bg-[#141517] w-[9rem] rounded flex border border-[#C3C3C3] dark:border-[#59575D] cursor-pointer xl:w-44 h-7"
>
	<div class=" px-2.5">
		<Icon src={MagnifyingGlass} class="w-3 text-[#364C55] dark:text-[#C8C5C5] stroke-2 " />
	</div>
	<input
		placeholder="Search..."
		class="text-black dark:text-white"
		bind:value
		on:input={() => {
			// dataGrid.setFilter(customFilter, value);
			// dataGrid.addFilter('all', '=', value);
			const filterIdx = tempFilters.findIndex((t) => t.field == "all");

			if (filterIdx >= 0) {
				tempFilters = [
					tempFilters[filterIdx == 0 ? 1 : 0],
					{
						field: "all",
						type: "=",
						value: value,
					},
				];
			} else {
				tempFilters.push({
					field: "all",
					type: "=",
					value: value,
				});
			}

			dataGrid.setFilter(tempFilters);
		}}
	/>
</div>

<style lang="postcss">
	input {
		@apply w-full bg-transparent pl-0.5 xl:text-xs;
		outline: none;
	}
	input:focus {
		@apply border-transparent;
	}
</style>
