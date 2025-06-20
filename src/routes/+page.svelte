<script lang="ts">
	import { getAbnormalReportData } from '$lib/api/graphql/abnormal';
	import type { TAbnormalReportResponse } from '$lib/api/graphql/abnormal/schema';
	import { getProductHistoryData } from '$lib/api/graphql/product';
	import type { TProductHistoryResponse } from '$lib/api/graphql/product/schema';
	import { streamRawData } from '$lib/api/mqtt/raw';
	import type { IRawsData } from '$lib/api/mqtt/raw/schema';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';

	const rangeStart: string = dayjs().format('2024-07-17');
	const rangeEnd: string = dayjs().format('2024-07-18');

	let productHistoryApiResult: TProductHistoryResponse | undefined = undefined;
	let getAbnormalReportDataRequest: TAbnormalReportResponse | undefined = undefined;
	let recentPredict: number;

	// Chart Data Source
	let chartTextData: IRawsData;
	let realtimeChartData: {
		time: number[];
		load: number[];
		predict: number[];
		loss: number[];
		productNo?: string;
	} = {
		time: [],
		load: [],
		predict: [],
		loss: []
	};

	onMount(async () => {
		// 메인 대시보드 생산 정보 데이터 조회
		productHistoryApiResult = await getProductHistoryData(
			{
				workshopId: 'W001',
				lineId: 'L001',
				opCode: 'OP10-3'
			},
			{
				rangeStart,
				rangeEnd
			}
		);
		console.log('productHistoryApiResult', productHistoryApiResult);

		// 이상 데이터 (PIE CHART) 조회
		getAbnormalReportDataRequest = await getAbnormalReportData({
			commonFilter: {
				workshopId: 'W001',
				lineId: 'L001',
				opCode: 'OP10-3'
			},
			rangeStart,
			rangeEnd
		});

		console.log('getAbnormalReportDataRequest', getAbnormalReportDataRequest);
	});

	streamRawData((message) => {
		// 실시간 데이터 수집
		collectChartData(message);
	});

	// 실시간 차트 데이터 수집
	function collectChartData(message: IRawsData) {
		console.log(message);
		recentPredict = message.predict;

		realtimeChartData.time.push(message.time / 1_000_000_000 + 9 * 60 * 60);
		realtimeChartData.load.push(message.load);
		realtimeChartData.predict.push(message.predict);
		realtimeChartData.loss.push(message.loss);
		realtimeChartData.productNo = message.product_id as string;
		chartTextData = message;
	}
</script>

<div></div>
