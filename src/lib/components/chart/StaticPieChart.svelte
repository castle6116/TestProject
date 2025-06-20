<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { EPieValueMode, type SciChartPieSurface } from 'scichart';
	import { createPieChartSurface, initPieChartSeries } from '$lib/scichart/chartTypes/pie/pieChart';
	import type { IPieChartData } from '$lib/scichart/chartTypes/pie/type';

	export let chartName: string;
	export let backgroundColor: string | undefined = '#191919';
	export let pieChartData: IPieChartData[];
	export let legendPlacementDivId: string;

	//#region Variable
	let pieChartSurface: SciChartPieSurface;
	//#endregion

	//#region onMount
	onMount(async () => {
		pieChartSurface = await createPieChartSurface({ chartName, backgroundColor });

		pieChartSurface.legend.placementDivId = legendPlacementDivId;

		initPieChartSeries({
			pieChartSurface,
			chartData: pieChartData
		});

		pieChartSurface.valueMode = EPieValueMode.Raw;
	});
	//#endregion

	//#region onDestroy
	onDestroy(() => {
		pieChartSurface?.delete();
	});
	//#endregion
</script>

<div class="relative h-full w-full bg-transparent">
	<div id={chartName} class="m-auto mt-1.5 h-full w-full" />
</div>
