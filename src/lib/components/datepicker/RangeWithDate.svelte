<script lang="ts">
	//#region import
	import DateInput from "./../input/DateInput.svelte";
	import RangePicker from "./RangePicker.svelte";
	import dayjs from "dayjs";
	import type { Dayjs } from "dayjs";
	//#endregion

	//#region property
	export let onDateSelected:
		| undefined
		| ((begin: Date, end: Date, aggregateInterval?: string) => Promise<void>) = undefined;
	export let id: string = "";
	export let customStyle: string = "";
	export let isRefresh: boolean = false;
	export let defaultFrom: dayjs.Dayjs | undefined = undefined;
	export let defaultTo: dayjs.Dayjs | undefined = undefined;
	export let defaultPeriod: "day" | "month" = "day";
	export let inputType: "datetime-local" | "month" = "datetime-local";
	export let aggregateInterval: string = "none";
	//#endregion

	//#region global variable
	let from: Dayjs = dayjs().startOf(defaultPeriod);
	let to: Dayjs = dayjs().endOf(defaultPeriod);
	let begin: Date = from.toDate();
	let end: Date = to.toDate();
	//#endregion

	//#region reactivity
	$: {
		// 기본값이 month 일 경우, 해당 월의 시작과 끝을 별도로 설정
		if (defaultPeriod == "month") {
			from = from.startOf("month");
			to = to.endOf("month");
		}

		if (defaultFrom) {
			from = defaultFrom;
			defaultFrom = undefined;
		}

		if (defaultTo) {
			to = defaultTo;
			defaultTo = undefined;
		}

		if (from.toDate() > to.toDate()) {
			[from, to] = [to, from]; // swap
		}
		begin = from.toDate();
		end = to.toDate();
	}

	$: {
		if (isRefresh) {
			from = dayjs().startOf(defaultPeriod);
			to = dayjs().endOf(defaultPeriod);
			begin = from.toDate();
			end = to.toDate();
			onDateSelected && onDateSelected(begin, end);
			isRefresh = false;
		}
	}
	//#endregion
</script>

<div class="flex flex-col w-full space-y-0 items-end">
	<div class="flex flex-row center gap-2 items-center {customStyle} ">
		<div class="flex justify-center gap-0.5">
			<DateInput bind:date={from} {inputType} inputId={`${id}from`} />
			<span class="dark:text-white text-black">~</span>
			<DateInput bind:date={to} {inputType} inputId={`${id}to`} />
		</div>

		<RangePicker bind:from bind:to />
		<button
			class="bg-transparent text-sm py-0.5 px-4 border border-[#3E3E41] rounded-md duration-200 hover:bg-[#1f1e1e]"
			on:click={async () => {
				onDateSelected && (await onDateSelected(begin, end, aggregateInterval));
			}}
		>
			조회
		</button>
	</div>
</div>
