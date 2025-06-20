<script lang="ts">
	import ProductCountReportChart from './ProductCountReportChart.svelte';
	import { getProductSumReportData } from '$lib/api/graphql/product';
	import type { TProductSumReportResponse } from '$lib/api/graphql/product/schema';
	import { onDestroy, onMount } from 'svelte';
	import { makeDateTime } from '$lib/common/date';
	import dayjs from 'dayjs';
	import Loading from '$lib/components/loading/Loading.svelte';

	const operationInfo = {
		workshopId: 'W001',
		lineId: 'L001',
		opCode: 'OP10-3'
	};

	let periodType: 'Monthly' | 'Weekly' | 'Daily' | 'Yearly' = 'Daily';
	let xLabelPostfix: string = '월';
	let productCountBarChartData:
		| {
				x: number[];
				y: number[];
		  }
		| undefined;

	let productCountBarDataSource: TProductSumReportResponse | undefined;

	let legendPlacementDivId = 'productCountReportChartLegend';
	let maxYValue: number = 500;

	let currentBegin: Date;
	let currentEnd: Date;

	onMount(() => {
		const today: Date = new Date(Date.now());

		currentBegin = new Date(today.getFullYear(), today.getMonth(), 1);
		currentEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

		getProductCountReportData(periodType, currentBegin, currentEnd);
	});

	onDestroy(() => {
		periodType = 'Monthly';
	});

	//#region Function
	async function getProductCountReportData(
		periodType: 'Monthly' | 'Weekly' | 'Daily' | 'Yearly',
		beginDate: Date,
		endDate: Date
	): Promise<void> {
		// 데이터 초기화
		productCountBarDataSource = undefined;
		productCountBarChartData = undefined;

		// 데이터 요청
		const getData = await getProductSumReportData({
			commonFilter: operationInfo,
			periodType: periodType,
			rangeStart: beginDate.toISOString(),
			rangeStop: endDate.toISOString()
		});

		productCountBarDataSource = getData;
		productCountBarChartData = parseChartData(productCountBarDataSource, periodType);
		// 최대 Y값 설정
		maxYValue = Math.max(...(productCountBarChartData.y || [])) * 1.4;
	}

	// 데이터 파싱
	function parseChartData(
		sumReportData: TProductSumReportResponse | undefined,
		periodType: 'Monthly' | 'Weekly' | 'Daily' | 'Yearly'
	): {
		x: number[];
		y: number[];
	} {
		const x: number[] = [];
		const y: number[] = [];

		if (!sumReportData) return { x, y };
		sumReportData.response.forEach((data, idx) => {
			let localTime = dayjs(data.time).subtract(9, 'hour').toISOString();
			const { month, day } = makeDateTime(localTime);
			if (periodType == 'Monthly' || periodType == 'Weekly') {
				x.push(Number(day));
				y.push(data.Count);
				xLabelPostfix = '일';
				return;
			}

			if (periodType == 'Yearly') {
				x.push(Number(month));
				y.push(data.Count);
				xLabelPostfix = '월';
				return;
			}

			if (periodType == 'Daily') {
				x.push(Number(idx + 1));
				y.push(data.Count);
				xLabelPostfix = '시';
				return;
			}
		});

		return { x, y };
	}

	//#endregion
</script>

<div class="h-full w-full">
	<!-- First Row -->

	<div class="h-[95%] w-full">
		{#if productCountBarChartData}
			{#if productCountBarChartData.x.length > 0}
				<ProductCountReportChart
					{maxYValue}
					{periodType}
					{xLabelPostfix}
					{legendPlacementDivId}
					chartSurfaceName="productCountReportChart"
					barChartData={productCountBarChartData}
				/>
			{:else}
				<div class="flex h-full w-full items-center justify-center">No Data</div>
			{/if}
		{:else}
			<Loading
				gradationEffect={{
					color: 'none'
				}}
			/>
		{/if}
	</div>
</div>
