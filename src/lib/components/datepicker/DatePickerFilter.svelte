<script lang="ts">
	// #region Import
	import dayjs from "dayjs";
	import { Icon, ChevronDown } from "svelte-hero-icons";
	import DatePicker from "./DatePicker.svelte";
	import { onDestroy } from "svelte";
	import { clickOutside } from "../../../dashboard/provider/click-outside";

	// #endregion

	export let period: string;
	// 일, 주, 월, 년 선택시 차트 표현
	export let onDateSelect: (
		periodType: string,
		beginDate: Date,
		endDate: Date,
		callBackFunc: (periodType: string, beginDate: Date, endDate: Date) => Promise<void>,
	) => void;
	export let callBackFunc: (periodType: string, beginDate: Date, endDate: Date) => Promise<void>;
	export let isRefresh: boolean = false;
	//#region Variable
	const today: Date = new Date(Date.now());

	let periodType: string;
	let isCalendarShow = false;
	let calendarViewType: string;
	let calendarBeginDate: Date = new Date(today.getFullYear(), today.getMonth(), 1);
	let calendarEndDate: Date = new Date(today.getFullYear(), today.getMonth() + 1, 0);

	let isDropdownOpen = false;
	//#endregion

	$: {
		if (isRefresh) {
			calendarBeginDate = new Date(today.getFullYear(), today.getMonth(), 1);
			calendarEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
			periodType = "Monthly";
			isRefresh = false;
		}
	}

	onDestroy(() => {
		periodType = "Monthly";
	});

	async function onDateSelectCallback(beginDate: Date, endDate: Date) {
		calendarBeginDate = beginDate;
		calendarEndDate = endDate;

		await onDateSelect(periodType, beginDate, endDate, callBackFunc);
	}

	function onToggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	// 선택한 옵션을 업데이트
	function selectOption(option: string) {
		option === "Daily"
			? (calendarViewType = "days")
			: option === "Monthly"
				? (calendarViewType = "months")
				: (calendarViewType = "years");
		isCalendarShow = true;

		periodType = option;

		onToggleDropdown();
	}

	//#region Variable _ Style
	const style = {
		pickerwrap: `flex items-center rounded-md bg-[#131316] border border-[#434346] py-0.5  2xl:text-xl 2xl:py-1.5 `,
		btn: `border-r border-gray-600 px-2 2xl:px-3 `,
		select: `bg-[#131316] ml-2.5`,
	};
	//#endregion
</script>

<div class="space-x-3 flex">
	<!-- 사용자 지정 시간 -->
	<div class="flex items-center justify-center text-[#BDC1DA] xl:text-lg pr-2">
		{#if periodType === "Daily"}
			{dayjs(calendarBeginDate).format("YYYY/MM/DD")}
		{:else}
			{dayjs(calendarBeginDate).format("YYYY/MM/DD")} ~ {dayjs(calendarEndDate).format(
				"YYYY/MM/DD",
			)}
		{/if}

		<DatePicker
			bind:period
			bind:isShow={isCalendarShow}
			viewType={calendarViewType}
			onDateSelected={onDateSelectCallback}
		/>
	</div>

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		use:clickOutside
		class={style.pickerwrap}
		on:click={onToggleDropdown}
		on:keypress={onToggleDropdown}
		on:click_outside={() => (isDropdownOpen = false)}
	>
		<button class={style.btn}>
			<!-- Icon -->
			<img
				src="https://i.esdrop.com/d/f/KRQCESGJO3/CRdI3xWEaW.png"
				alt=""
				class="w-4 h-4 2xl:w-5 2xl:h-5"
			/>
		</button>
		<!-- Select Box -->
		<div
			class="dropdown bg-[#131316] duration-1000 transition items-center justify-center px-2.5"
			class:open={isDropdownOpen}
		>
			<div
				class="dropdown-toggle flex justify-center items-center cursor-pointer"
				role="presentation"
			>
				{periodType
					? periodType === "Monthly"
						? "월"
						: periodType === "Daily"
							? "일"
							: "년"
					: "월"}
				<Icon src={ChevronDown} class="w-3 ml-2 stroke-2 text-gray-500" />
			</div>
			<div class="pt-2.5 absolute w-20">
				<ul
					class="dropdown-menu bg-[#131316] text-white absolute overflow-hidden {isDropdownOpen
						? 'h-[7.5rem] 2xl:h-[8.5rem]'
						: 'h-0'} duration-150 z-10 w-20 right-8 rounded"
				>
					<li
						on:click={() => selectOption("Daily")}
						on:keypress={() => selectOption("Daily")}
						role="presentation"
					>
						일
					</li>
					<li
						on:click={() => selectOption("Monthly")}
						on:keypress={() => selectOption("Monthly")}
						role="presentation"
					>
						월
					</li>
					<li
						on:click={() => selectOption("Yearly")}
						on:keypress={() => selectOption("Yearly")}
						role="presentation"
					>
						년
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	select {
		@apply focus:border-transparent focus:ring-0 focus:ring-[#3D3C41] border-none;
		background-size: 20px;
		padding: 0 2rem 0 0;
		outline: 0 none;
	}

	#select > option {
		@apply bg-black;
		background: black;
		color: #fff;
		padding: 3px 0;
	}
	ul > li {
		@apply py-2  text-center hover:text-blue-600 cursor-pointer;
	}
</style>
