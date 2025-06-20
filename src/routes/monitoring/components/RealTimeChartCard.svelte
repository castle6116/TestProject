<script lang="ts">
	import type { IRawsData } from '$lib/api/mqtt/raw/schema';
	import CommonCard from '$lib/components/card/CommonCard.svelte';
	import Display from '$lib/components/display/Display.svelte';
	import MainMonitoringChart from './MainMonitoringChart.svelte';
	import { NumberRange, type NumericAxis } from 'scichart';
	import { onDestroy, onMount } from 'svelte';
	import { isDarkMode } from '$dashboard/provider/store';

	$: darkMode = $isDarkMode;

	export let chartNames: string[];
	export let isErrorEffect: boolean = false;
	export let alarmTimeInfo: { startTime: string; endTime: string } | undefined;
	export let toolStartInfo: { toolCode: string; startTime: number; value: number } | undefined;
	export let chartTextData: IRawsData;
	export let realtimeChartData: {
		time: number[];
		load: number[];
		predict: number[];
		loss: number[];
		productNo?: string;
	};

	//#region Variable
	// TODO: UpdatePeriod & visibleSecondsRange Config로 추출
	const updatePeriod: number = 100;
	const visibleSecondsRange: number = 180;
	const legendPlacementDivId: string = 'realtime_legend';
	let upperXAxis: NumericAxis;
	let dataSource:
		| { time: number[]; load: number[]; predict: number[]; loss: number[]; productNo?: string }
		| undefined = undefined;
	let streamTimer: NodeJS.Timeout;
	//#endregion

	//#region onMount
	onMount(async () => {
		streamTimer = await StreamMultiChart();
	});
	//#endregion

	//#region onDestroy
	onDestroy(() => {
		clearTimeout(streamTimer);
	});

	//#endregion
	//#region Function
	async function StreamMultiChart(): Promise<NodeJS.Timeout> {
		if (realtimeChartData.time.length >= 1) {
			dataSource = {
				time: [...realtimeChartData.time],
				load: [...realtimeChartData.load],
				predict: [...realtimeChartData.predict],
				loss: [...realtimeChartData.loss],
				productNo: realtimeChartData.productNo
			};

			// Clear the data
			realtimeChartData = {
				time: [],
				load: [],
				predict: [],
				loss: []
			};
		}

		// X 축 업데이트
		if (upperXAxis != undefined) {
			let currentTimestamp = new Date().getTime() / 1_000 + 9 * 60 * 60;
			upperXAxis.visibleRange = new NumberRange(
				currentTimestamp - visibleSecondsRange,
				currentTimestamp
			);
		}
		return setTimeout(() => StreamMultiChart(), updatePeriod / 2);
	}

	function checkEmptyData(value: string | number): string {
		if (typeof value == 'number') {
			return value.toFixed(2);
		}

		return value ? value.toString() : 'N/A';
	}
	//#endregion

	//#region Display Component Props
	$: displayProps = [
		{
			caption: 'T 코드',
			borderColor: darkMode ? 'border-[#484855]' : 'border-[#C3C3C3]',
			backgroundColor: darkMode ? '' : 'bg-[#F7F6F6]',
			textColor: darkMode ? 'text-[#A7A7CC]' : 'text-[#2C3C44]',
			textAlign: 'text-center'
		},
		{
			caption: checkEmptyData(chartTextData?.tcode),
			borderColor: 'border-none',
			backgroundColor: '',
			textColor: darkMode ? 'text-[white]' : 'text-black',
			textAlign: 'text-center'
		},
		{
			caption: 'M 코드',
			borderColor: darkMode ? 'border-[#484855]' : 'border-[#C3C3C3]',
			backgroundColor: darkMode ? '' : 'bg-[#F7F6F6]',
			textColor: darkMode ? 'text-[#A7A7CC]' : 'text-[#2C3C44]',
			textAlign: 'text-center'
		},
		{
			caption: checkEmptyData(chartTextData?.mcode),
			borderColor: 'border-none',
			backgroundColor: '',
			textColor: darkMode ? 'text-[white]' : 'text-black',
			textAlign: 'text-center'
		},
		{
			caption: 'Feed',
			borderColor: darkMode ? 'border-[#484855]' : 'border-[#C3C3C3]',
			backgroundColor: darkMode ? '' : 'bg-[#F7F6F6]',
			textColor: darkMode ? 'text-[#A7A7CC]' : 'text-[#2C3C44]',
			textAlign: 'text-center'
		},
		{
			caption: checkEmptyData(chartTextData?.feed),
			borderColor: 'border-none',
			backgroundColor: '',
			textColor: darkMode ? 'text-[white]' : 'text-black',
			textAlign: 'text-center',
			width: 'w-20'
		},
		{
			caption: '실제부하',
			borderColor: darkMode ? 'border-[#484855]' : 'border-[#C3C3C3]',
			backgroundColor: darkMode ? '' : 'bg-[#F7F6F6]',
			textColor: darkMode ? 'text-[#A7A7CC]' : 'text-[#2C3C44]',
			textAlign: 'text-center',
			width: 'w-16'
		},
		{
			caption: checkEmptyData(chartTextData?.load),
			borderColor: 'border-none',
			backgroundColor: '',
			textColor: darkMode ? 'text-[white]' : 'text-black',
			textAlign: 'text-left',
			width: 'w-20'
		},
		{
			caption: '예측부하',
			borderColor: darkMode ? 'border-[#484855]' : 'border-[#C3C3C3]',
			backgroundColor: darkMode ? '' : 'bg-[#F7F6F6]',
			textColor: darkMode ? 'text-[#A7A7CC]' : 'text-[#2C3C44]',
			textAlign: 'text-center',
			width: 'w-16'
		},
		{
			caption: checkEmptyData(chartTextData?.predict),
			borderColor: 'border-none',
			backgroundColor: '',
			textColor: darkMode ? 'text-[white]' : 'text-black',
			textAlign: 'text-left',
			width: 'w-20'
		},
		{
			caption: '오차율',
			borderColor: darkMode ? 'border-[#484855]' : 'border-[#C3C3C3]',
			backgroundColor: darkMode ? '' : 'bg-[#F7F6F6]',
			textColor: darkMode ? 'text-[#A7A7CC]' : 'text-[#2C3C44]',
			textAlign: 'text-center'
		},
		{
			caption: checkEmptyData(chartTextData?.loss),
			borderColor: 'border-none',
			backgroundColor: '',
			textColor: darkMode ? 'text-[white]' : 'text-black',
			textAlign: 'text-left'
		}
	];
	//#endregion
</script>

<CommonCard caption="실시간 AI 이상감지" {isErrorEffect} style="min-w-[500px]">
	<div class="h-full w-full min-w-[900px]">
		<div class="relative flex h-[3%]">
			<div
				id={legendPlacementDivId}
				class="flex w-[200px] items-center justify-center pt-1 !text-xs"
			></div>
			<div class="flex w-[75%] items-center justify-center gap-2">
				{#each displayProps as { caption, borderColor, backgroundColor, textColor, textAlign, width }}
					<Display {caption} {borderColor} {backgroundColor} {textColor} {textAlign} {width} />
				{/each}
			</div>
		</div>
		<MainMonitoringChart
			bind:dataSource
			bind:toolStartInfo
			bind:upperXAxis
			bind:alarmTimeInfo
			{chartNames}
			{legendPlacementDivId}
			fifoCapacity={2400}
			isRealTime={true}
			isShowProductNoAnnotation={true}
		/>
	</div>
</CommonCard>
