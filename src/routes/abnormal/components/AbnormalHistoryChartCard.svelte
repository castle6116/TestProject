<script lang="ts">
	import { makeDateString } from '$lib/common/date';
	import CommonCard from '$lib/components/card/CommonCard.svelte';
	import Loading from '$lib/components/loading/Loading.svelte';
	import MainMonitoringChart from '../../monitoring/components/MainMonitoringChart.svelte';

	export let chartData:
		| { time: number[]; load: number[]; predict: number[]; loss: number[]; productNo?: string }
		| undefined;

	// 차트에 표시할 이상감지 시간 구간
	export let abnormalTimeInfo: { startTime: string; endTime: string } | undefined = undefined;

	const legendPlacementDivId = 'abnormalHistoryChartLegend';

	let xLabelPrefix: string;

	// 데이터가 존재하고, Time 데이터가 존재할 경우 Prefix 주입
	$: if (chartData && chartData.time.length > 0) {
		let datePrefix: string = makeDateString(
			new Date((chartData.time[0] - 9 * 3600) * 1000).toISOString(),
			true
		);
		xLabelPrefix = datePrefix + ' ';
	}
</script>

<!-- content here -->
<CommonCard
	style="w-full"
	caption="이상감지 공구 부하 차트"
	borderStyle="border-none"
	titleBackground="#121416"
>
	{#if chartData}
		<div class="h-full w-full">
			<div class="relative flex w-full">
				<div id={legendPlacementDivId} class="w-[200px] pl-2 text-xs"></div>
				<span
					class="absolute left-[50%] top-1 translate-x-[-50%] rounded-[4px] bg-[#E2F2E9] px-2 py-0.5 text-xs text-[#149A65] dark:bg-[#1560425f] dark:text-[#36f0a5]"
				>
					{chartData.productNo || '공구번호 없음'}
				</span>
			</div>
			<MainMonitoringChart
				{xLabelPrefix}
				{legendPlacementDivId}
				autoTicksY={true}
				isRealTime={false}
				isTooltipActive={true}
				isInnerYUpperAxis={false}
				isInnerYLowerAxis={false}
				dataSource={chartData}
				alarmTimeInfo={abnormalTimeInfo}
				yAxisAlignment="Right"
				yLabelAlignment="Left"
				backgroundColor="#121416"
				chartNames={['abnormalStaticUpper', 'abnormalStaticBelow']}
			/>
		</div>
	{:else}
		<Loading gradationEffect={{ color: 'none' }} />
	{/if}
</CommonCard>
