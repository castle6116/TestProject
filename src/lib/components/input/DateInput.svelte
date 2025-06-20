<script lang="ts">
	//#region import
	import dayjs, { Dayjs } from "dayjs";
	//#endregion

	//#region Variable_Style
	const style = {
		btn: `border border-[#C3C3C3] dark:border-[#3E3E41] text-center rounded-md focus:border-white focus:ring-1 focus:ring-[#3D3C41] text-[#364C55] dark:text-white bg-[#F7F6F6] dark:bg-transparent py-0.5 text-sm`,
	};
	//#endregion

	//#region property
	export let date: Dayjs;
	export let inputType: "datetime-local" | "month" = "datetime-local";
	export let inputId: string;
	//#endregion

	//#region global variable
	$: format = inputType == "datetime-local" ? "YYYY-MM-DD HH:mm" : "YYYY-MM";

	let internal: string;
	//#endregion

	//#region function
	const input = (x: string | Dayjs) => (internal = dayjs(x).format(format));
	const output = (x: string) => {
		if (dayjs(x, format).isValid()) {
			date = dayjs(x, format);
		} else {
			input(date);
		}
	};

	const focusOut = () => {
		input(internal);
		output(internal);
	};
	//#endregion

	//#region onMount
	//#endregion

	//#region reactivity
	$: input(date);

	// $: {
	// 	output(internal);
	// }
	//#endregion

	// function onPressKeyboard(
	// 	e: KeyboardEvent & {
	// 		currentTarget: EventTarget & HTMLInputElement;
	// 	},
	// ) {
	// 	const target = e.target as HTMLInputElement;

	// 	if (e.key === "ArrowUp") {
	// 		adjustDate(target.value, 1);
	// 	} else if (e.key === "ArrowDown") {
	// 		adjustDate(target.value, -1);
	// 	}
	// }

	// function adjustDate(date: string, monthAdjustment: number) {
	// 	const currentDate = new Date(date);
	// 	if (!currentDate) return; // 날짜가 유효하지 않으면 종료

	// 	// Adjust the month
	// 	let targetMonth = currentDate.getMonth() + monthAdjustment;
	// 	let targetYear = currentDate.getFullYear();

	// 	// 월 조정 및 연도 조정
	// 	if (targetMonth < 0) {
	// 		targetMonth += 12;
	// 		targetYear -= 1;
	// 	} else if (targetMonth > 11) {
	// 		targetMonth -= 12;
	// 		targetYear += 1;
	// 	}

	// 	// 해당 월의 마지막 날짜로 조정
	// 	const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
	// 	const day = Math.min(currentDate.getDate(), lastDayOfTargetMonth);

	// 	// 새로운 날짜로 설정
	// 	const newDate = new Date(
	// 		targetYear,
	// 		targetMonth,
	// 		day,
	// 		currentDate.getHours(),
	// 		currentDate.getMinutes(),
	// 	);
	// 	output(newDate.toISOString().slice(0, 16)); // datetime-local 형식에 맞춰 적용
	// }
</script>

{#if inputType === "datetime-local"}
	<input
		id={inputId}
		disabled={false}
		class={style.btn}
		type="datetime"
		required
		bind:value={internal}
		on:focusout={focusOut}
	/>
{:else if inputType === "month"}
	<input
		id={inputId}
		disabled={false}
		class={style.btn}
		type="month"
		required
		bind:value={internal}
		on:focusout={focusOut}
	/>
{/if}

<style>
	input[type="datetime-local"]::-webkit-inner-spin-button,
	input[type="datetime-local"]::-webkit-calendar-picker-indicator {
		display: none;
		-webkit-appearance: none;
	}
	input[type="datetime-local"]::selection {
		background: transparent;
	}
	input[type="month"]::-webkit-calendar-picker-indicator {
		display: none;
		-webkit-appearance: none;
	}
	input[type="month"]::selection {
		background: transparent;
	}
</style>
