<script lang="ts">
	import StaticPieChart from '$lib/components/chart/StaticPieChart.svelte';
	import CommonCard from '$lib/components/card/CommonCard.svelte';
	import Loading from '$lib/components/loading/Loading.svelte';
	import type { IPieChartData } from '$lib/scichart/chartTypes/pie/type';

	export let pieChartData: IPieChartData[] | undefined;
</script>

<CommonCard
	style="w-full"
	caption="이상감지 발생 통계"
	borderStyle="border-none"
	titleBackground="#121416"
>
	{#if pieChartData}
		<div class="flex h-full w-full px-2 pb-2">
			<div id="abnormalPieChart" class="z-10 w-32 bg-white text-[10px] dark:bg-[#191919]"></div>
			<StaticPieChart
				chartName="abnormalStaticPieChart"
				legendPlacementDivId="abnormalPieChart"
				backgroundColor="#121416"
				{pieChartData}
			/>
		</div>
	{:else}
		<Loading gradationEffect={{ color: '#121416', duration: '6s' }} />
	{/if}
</CommonCard>
