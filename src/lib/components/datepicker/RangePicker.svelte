<script lang="ts">
	//#region import
	import DatePicker from "roylabs-svelte-datepicker-ts/src/components/DatePicker.svelte";
	import { CalendarStyle } from "./schema";
	import type { Dayjs } from "dayjs";
	import dayjs from "dayjs";
	import { onMount } from "svelte";
	import { isDarkMode } from "../../../dashboard/provider/store";
	//#endregion

	//#region Variable _ Style
	const style = {
		btn: `dark:bg-[#0E0E0E] bg-[#F7F6F6] border border-[#C3C3C3] dark:border-[#434346] rounded-md pl-4 overflow-hidden text-white`,
	};
	let calendarStyle = new CalendarStyle();
	//#endregion

	//#region property
	// 오늘 자정 00
	export let from: Dayjs;
	// 다음날 자정 00
	export let to: Dayjs;

	export let onDateSelected: undefined | ((begin: Date, end: Date) => void) = undefined;
	//#endregion

	//#region global variable
	let selected: Dayjs[] = [from, to];
	//#endregion

	//#region reactivity
	$: {
		selected[0] = from;
		selected[1] = to;
	}

	$: {
		calendarStyle = new CalendarStyle({
			contentBackground: $isDarkMode ? "#262626" : "white",
			dayTextColorIsNight: $isDarkMode ? "white" : "black",
			currentDayTextColor: $isDarkMode ? "red" : "black",
			monthYearTextColor: $isDarkMode ? "white" : "black",
			todayBorderWidth: "0px",
			timeNightModeBackgroundColor: $isDarkMode ? "#262626" : "white",
			timeDayModeTextColor: $isDarkMode ? "white" : "black",
			timeNightModeTextColor: $isDarkMode ? "white" : "black",
		});
	}
	//#endregion

	//#region function
	function onChnage() {
		from = selected[0];
		to = selected[1];
		onDateSelected && onDateSelected(from.toDate(), to.toDate());
	}
	//#endregion

	//#region mount
	onMount(() => {
		dayjs.locale("ko");
	});
	//#endregion
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<DatePicker styling={calendarStyle} range={true} time={true} bind:selected on:change={onChnage}>
	<button type="button" class={style.btn} style="padding-left: 0;">
		<div
			class="flex items-center justify-center py-0.5 divide-x dark:divide-gray-600 divide-[#C3C3C3] duration-200 hover:bg-[#1f1e1e]"
		>
			<span class="px-2 text-gray-100">
				<!-- Icon -->
				<img src="https://i.esdrop.com/d/f/KRQCESGJO3/v7ZUt823Rd.png" alt="" class="w-4 h-4" />
			</span>
			<span class="px-4 text-sm dark:text-white text-[#364C55]">
				{"기간 선택"}
				<!-- {#if from.format("YYYY-MM-DD HH:mm:ss") === ""}
							{`Date Picker`}
						{:else}
							{`${from.format("YYYY-MM-DD HH:mm:ss")}~${to.format("YYYY-MM-DD HH:mm:ss")}`}
						{/if} -->
			</span>
		</div>
	</button>
</DatePicker>
