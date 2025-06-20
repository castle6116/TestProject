<script lang="ts">
	import type { Tabulator } from 'tabulator-tables';
	import AbnormalHistoryChartCard from './components/AbnormalHistoryChartCard.svelte';
	import AbnormalHistoryGridCard from './components/AbnormalHistoryGridCard.svelte';
	import AbnormalStatisticsCard from './components/AbnormalStatisticsCard.svelte';
	import type { IPieChartData } from '$lib/scichart/chartTypes/pie/type';
	import type {
		IAbnormalData,
		IAbnormalReportData,
		IFilterAbnormalArgs,
		TAbnormalReportResponse
	} from '$lib/api/graphql/abnormal/schema';
	import { onMount } from 'svelte';
	import { getAbnormalReportData } from '$lib/api/graphql/abnormal';
	import dayjs from 'dayjs';
	import {
		ABNORMAL_BROKEN,
		ABNORMAL_LOAD,
		ABNORMAL_QUALITY,
		ABNORMAL_TOOL,
		ABNORMAL_WEAR
	} from '$constants/code';

	const colorLinearGradientList: { from: string; to: string }[] = [
		{ from: '#faa96d', to: '#d7762e' },
		{ from: '#85edaf', to: '#1bca85' },
		{ from: '#68a0ca', to: '#92c8f2' },
		{ from: '#672bd3', to: '#b489fb' },
		{ from: '#09b0b1', to: '#009596' },
		{ from: '#5ab0ff', to: '#0e6ed0' },
		{ from: '#ffd780', to: '#dda630' }
	];

	let dataGrid: Tabulator;
	let pieChartData: IPieChartData[] | undefined = undefined;
	let chartData:
		| { time: number[]; load: number[]; predict: number[]; loss: number[]; productNo?: string }
		| undefined = { time: [], load: [], predict: [], loss: [] };
	let historyData: IAbnormalData[] | undefined;
	let abnormalTimeInfo: { startTime: string; endTime: string } | undefined = undefined;
	let abnormalFilter: IFilterAbnormalArgs;

	const rangeStart: string = dayjs().format('2024-04-25');
	const rangeEnd: string = dayjs().format('2024-04-30');
	let getAbnormalReportDataRequest: TAbnormalReportResponse | undefined = undefined;
	const operationInfo = {
		workshopId: 'W001',
		lineId: 'L001',
		opCode: 'OP10-3'
	};

	onMount(async () => {
		// 이상 데이터 (PIE CHART) 조회
		getAbnormalReportDataRequest = await getAbnormalReportData({
			commonFilter: operationInfo,
			rangeStart,
			rangeEnd
		});

		console.log('getAbnormalReportDataRequest', getAbnormalReportDataRequest);

		abnormalTimeInfo = {
			startTime: rangeStart,
			endTime: rangeEnd
		};

		pieChartData = getAbnormalReportDataRequest.response.map(
			(data: IAbnormalReportData, idx: number) => {
				return parsePieChartData(data, idx);
			}
		);

		abnormalFilter = {
			commonFilter: operationInfo,
			rangeStart: rangeStart,
			rangeEnd: rangeEnd
		};
	});

	// Pie Chart 데이터 Parsing
	function parsePieChartData(data: IAbnormalReportData, idx: number): IPieChartData {
		return {
			// text: ((data.abnormalTool || '') + ' ' + data.abnormalCode).trim(),
			text: parseAbnormalCodeToDesc(data.abnormalCode.trim()),
			value: data.abnormalCount,
			colorLinearGradient: colorLinearGradientList[idx]
		};
	}

	function parseAbnormalCodeToDesc(abnormalCode: string): string {
		switch (abnormalCode) {
			case ABNORMAL_QUALITY:
				return '품질';
			case ABNORMAL_LOAD:
				return '부하';
			case ABNORMAL_TOOL:
				return '공구';
			case ABNORMAL_WEAR:
				return '마모';
			case ABNORMAL_BROKEN:
				return '파손';
			default:
				return '기타';
		}
	}
</script>

<div class="flex h-full w-full flex-col gap-5">
	<div class="w-fullq h-[50%]">
		<AbnormalHistoryGridCard
			bind:dataGrid
			bind:chartData
			bind:historyData
			bind:abnormalTimeInfo
			bind:abnormalFilter
			isHistoryGridLoading={false}
			{operationInfo}
		></AbnormalHistoryGridCard>
	</div>
	<div class="flex h-[50%] w-full gap-5">
		<div class="w-[30%]">
			<AbnormalStatisticsCard bind:pieChartData></AbnormalStatisticsCard>
		</div>
		<div class="w-[70%]">
			<AbnormalHistoryChartCard bind:chartData bind:abnormalTimeInfo></AbnormalHistoryChartCard>
		</div>
	</div>
</div>
