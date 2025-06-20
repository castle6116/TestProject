<script lang="ts">
	import { InlineCalendar } from "svelte-calendar";
	import { themes } from "svelte-calendar";
	// #region Import
	import { onMount } from "svelte";
	import dayjs from "dayjs";
	import "dayjs/locale/ko";
	import { initDateRange } from "$lib/common/date";
	// #endregion

	interface DatePickerStore {
		set: (
			this: void,
			value: {
				open: boolean;
				hasChosen: boolean;
				selected: any;
				start: Date;
				end: Date;
				shouldEnlargeDay: boolean;
				enlargeDay: boolean;
				year: any;
				month: any;
				day: any;
				activeView: string;
				activeViewDirection: number;
				startOfWeekIndex: number;
			},
		) => void;
		subscribe: (
			this: void,
			run: import("svelte/store").Subscriber<{
				open: boolean;
				hasChosen: boolean;
				selected: any;
				start: Date;
				end: Date;
				shouldEnlargeDay: boolean;
				enlargeDay: boolean;
				year: any;
				month: any;
				day: any;
				activeView: string;
				activeViewDirection: number;
				startOfWeekIndex: number;
			}>,
			invalidate?: (value?: {
				open: boolean;
				hasChosen: boolean;
				selected: any;
				start: Date;
				end: Date;
				shouldEnlargeDay: boolean;
				enlargeDay: boolean;
				year: any;
				month: any;
				day: any;
				activeView: string;
				activeViewDirection: number;
				startOfWeekIndex: number;
			}) => void,
		) => import("svelte/store").Unsubscriber;
		getState(): {
			open: boolean;
			hasChosen: boolean;
			selected: any;
			start: Date;
			end: Date;
			shouldEnlargeDay: boolean;
			enlargeDay: boolean;
			year: any;
			month: any;
			day: any;
			activeView: string;
			activeViewDirection: number;
			startOfWeekIndex: number;
		};
		enlargeDay(enlargeDay?: boolean): void;
		getSelectableVector(date: any): 0 | 1 | -1;
		isSelectable(date: any, clamping?: any[]): any;
		clampValue(day: any, clampable: any): any;
		add(amount: any, unit: any, clampable?: any[]): void;
		setActiveView(newActiveView: any): void;
		setYear(year: any): void;
		setMonth(month: any): void;
		setDay(day: any): void;
		close(extraState: any): void;
		selectDay(): void;
		getCalendarPage(
			month: any,
			year: any,
		): {
			date: any;
			outsider: boolean;
		}[];
	}

	// #region State
	export let period: string;
	export let viewType: string;
	export let onDateSelected: (begin: Date, end: Date) => void;
	export let isShow: boolean;
	// #endregion

	let store: DatePickerStore;
	let beginDate: Date = new Date(Date.now());
	let endDate: Date = new Date(Date.now());
	let { start: beginDateString, end: endDateString } = initDateRange();
	beginDateString = dayjs(beginDateString).format("YYYY/MM/DD");
	endDateString = dayjs(endDateString).format("YYYY/MM/DD");
	let isSelected: boolean = false;
	let prevViewType: string;
	let prevViewYear: number;
	let prevViewMonth: number;
	let prevViewDay: number;
	let dialog: HTMLDialogElement; // HTMLDialogElement

	$: {
		if (store) {
			let isViewChanged: boolean = false;

			if (prevViewType !== viewType) {
				store.set({
					...store.getState(),
					...{ open: true, shouldEnlargeDay: false, activeView: viewType },
				});

				prevViewType = viewType;
				isViewChanged = true;
			}

			if (viewType === "years") {
				if (
					//store.getState().activeView !== "days" &&
					store.getState().activeView !== viewType
				) {
					store.setDay(new Date(store.getState().year, 0, 1));

					setTimeout(() => {
						store.selectDay();
					}, 1);

					store.setActiveView(viewType);

					isSelected = true;

					getPeriod();
					onDateSelected(beginDate, endDate);

					isShow = false;
				}
			} else if (viewType === "months") {
				if (store.getState().activeView !== viewType) {
					store.setDay(new Date(store.getState().year, store.getState().month, 1));

					setTimeout(() => {
						store.selectDay();
					}, 1);

					store.setActiveView(viewType);

					isSelected = true;

					getPeriod();
					onDateSelected(beginDate, endDate);

					isShow = false;
				}
			} else {
				store.setActiveView(viewType);

				if (
					(store.getState().year !== prevViewYear || store.getState().month !== prevViewMonth) &&
					store.getState().day === prevViewDay
				) {
					//console.log("Update Previous");
				} else if (
					!isViewChanged &&
					store.getState().hasChosen &&
					store.getState().year === prevViewYear &&
					store.getState().month === prevViewMonth
				) {
					//console.log("Month Turn");
					store.setDay(
						new Date(store.getState().year, store.getState().month, store.getState().day),
					);

					getPeriod();
					onDateSelected(beginDate, endDate);
					isShow = false;
				}

				prevViewYear = store.getState().year;
				prevViewMonth = store.getState().month;
				prevViewDay = store.getState().day;
			}

			// if (beginDate.toDateString() !== (store.getState().selected as Date).toDateString()) {
			// 	getPeriod();
			// 	onDateSelected(beginDate, endDate);

			// 	isShow = false;
			// }
		}

		if ($store) {
			if ($store.hasChosen) {
				isSelected = true;
			}
		}
	}
	$: {
		if (dialog && isShow) {
			dialog.showModal();
		} else if (dialog && !isShow) {
			dialog.close();
		}
	}

	onMount(() => {
		store?.setActiveView(viewType);
		prevViewType = store?.getState().activeView;

		dayjs.locale("ko");
	});

	function getPeriod() {
		beginDate = store?.getState().selected;

		if (viewType === "years") {
			endDate = new Date(beginDate.getFullYear(), 11, 31, 23, 59, 59, 999);
			period = "Yearly";
		} else if (viewType === "months") {
			period = "Monthly";
			endDate = new Date(
				beginDate.getMonth() === 11 ? beginDate.getFullYear() + 1 : beginDate.getFullYear(),
				beginDate.getMonth() === 11 ? 0 : beginDate.getMonth() + 1,
				0,
				0,
				0,
				0,
				0,
			);
		} else {
			period = "Daily";
			endDate = beginDate;
		}

		beginDateString = dayjs(beginDate).format("YYYY/MM/DD");
		endDateString = dayjs(endDate).format("YYYY/MM/DD");
	}
	// function onChagePeriod(e: Event) {
	// 	viewType = e.target.value;
	// }

	//#region Style
	const style = {
		btn: `bg-[#131316] border border-[#434346] rounded-md focus:border-transparent focus:ring-1 focus:ring-[#3D3C41] pl-4 py-1 text-white 2xl:text-xl 2xl:py-1.5 `,
	};

	// Customizing Calendar Style
	// const theme = {
	// 	calendar: {
	// 		width: "150px",
	// 		maxWidth: "100vw",
	// 		legend: {
	// 			height: "45px",
	// 		},
	// 		shadow: "0px 10px 26px rgba(0, 0, 0, 0.25)",
	// 		colors: {
	// 			text: {
	// 				primary: "#fff",
	// 				highlight: "#333",
	// 			},
	// 			background: {
	// 				primary: "#4B5563",
	// 				highlight: "#3F83F8",
	// 				hover: "#4B5563",
	// 			},
	// 			border: "#eee",
	// 		},
	// 		font: {
	// 			regular: "1em",
	// 			large: "37em",
	// 		},
	// 		grid: {
	// 			disabledOpacity: ".35",
	// 			outsiderOpacity: ".6",
	// 		},
	// 	},
	// };

	themes.dark.calendar.width = "800px";
	//#endregion
</script>

<div class="">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<dialog
		bind:this={dialog}
		on:close={() => (isShow = false)}
		on:click|self={() => dialog.close()}
		class="p-6 bg-[#2f2a2a] rounded-md"
		role="presentation"
	>
		<div class="">
			<div class="w-full h-full">
				<InlineCalendar theme={themes.dark} bind:store />
			</div>
		</div>
	</dialog>
</div>

<style>
	dialog {
		margin: auto;
	}
</style>
