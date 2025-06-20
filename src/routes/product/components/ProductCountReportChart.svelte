<script lang="ts">
	import { isDarkMode } from '$dashboard/provider/store';

	import { Thickness } from 'scichart';
	import type { XyDataSeries, LegendModifier, FastLineRenderableSeries } from 'scichart';
	import { onMount } from 'svelte';
	import { NumberRange } from 'scichart/Core/NumberRange';
	import { createColumnRenderableSeries } from '$lib/scichart/chartTypes/column/columnChart';
	import { createLineRenderableSeries } from '$lib/scichart/chartTypes/line/lineChart';
	import { addChartRenderableSeries, initDataSeries } from '$lib/scichart/core/series';
	import type { IChartCommonParams } from '$lib/scichart/core/type';
	import { addLegendModifier, showTooltipOnGraph } from '$lib/scichart/interactions/modifier';
	import { initializeChart } from '$lib/scichart/core/initializer';

	export let periodType: 'Monthly' | 'Weekly' | 'Daily' | 'Yearly' = 'Monthly';
	export let backgroundColor: string = '#191919';
	export let yLabel: string[] = ['주차', '일'];
	export let xLabelPostfix: string;
	export let autoTicksY: boolean = true;
	export let maxYValue: number;
	export let chartSurfaceName: string;
	export let legendPlacementDivId: string;
	export let lineChartData:
		| {
				x: number[];
				y: number[];
		  }
		| undefined = undefined;

	export let barChartData: {
		x: number[];
		y: number[];
	};

	let chartProperties: IChartCommonParams;
	let barChartDataSeries: XyDataSeries;
	let lineChartDataSeries: XyDataSeries;
	let lineChartRenderableSeries: FastLineRenderableSeries;
	let legendModifier: LegendModifier;
	let isReady: boolean = false;

	$: {
		if (isReady && periodType) {
			chartProperties.sciChartSurface.renderableSeries.clear();
			chartProperties.sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(
				barChartData.x[0],
				barChartData.x[barChartData.x.length - 1]
			);

			// if (periodType == "Yearly") {
			// 	chartProperties.sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(1, 12);
			// } else if (periodType == "Daily") {
			// 	chartProperties.sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(0, 23);
			// }

			updateBarChartData();
		}
	}

	$: if (isReady && periodType == 'Monthly') {
		updateLineChartData();
	}

	onMount(async () => {
		chartProperties = await initializeChart({
			chartSurfaceParam: {
				chartName: chartSurfaceName,
				isDrawBehind: false,
				background: backgroundColor
			},
			xAxisParam: {
				autoTicksX: false,
				xAxisType: 'Numeric',
				labelPostfix: xLabelPostfix,
				gridLineColor: backgroundColor
					? { minor: backgroundColor, major: backgroundColor }
					: undefined
			},
			yAxisParam: {
				yRange: [0, maxYValue],
				setYVisibleRange: true,
				isInnerAxis: false,
				axisAlignment: 'Right',
				autoTicksY: autoTicksY,
				yRangePadding: { min: 0, max: 0.3 },
				majorDelta: 10000,
				yGridLineColor: backgroundColor
					? { minor: backgroundColor, major: '#ffffff66' }
					: undefined,
				axisBorder: {
					borderLeft: 10
				},
				padding: new Thickness(0, 2, 0, 6)
			}
		});

		//#region Modifier 추가
		legendModifier = addLegendModifier({
			chartSurface: chartProperties.sciChartSurface,
			placementDivId: legendPlacementDivId
		});

		showTooltipOnGraph({
			surface: chartProperties.sciChartSurface,
			replaceHoverData: {
				yLabel,
				yValueSuffix: ' 개'
			},
			cursorModifierOptions: {
				crosshairStrokeThickness: 1,
				crosshairStroke: $isDarkMode ? '#EA9C0E66' : '#000000',
				tooltipTextStroke: $isDarkMode ? 'white' : '#000000',
				tooltipContainerBackground: $isDarkMode ? '#EA9C0E' : '#F4F4F4'
			}
		});

		isReady = true;
	});

	function updateBarChartData() {
		let dataSeriesName: string = '일 생산량';
		if (periodType == 'Monthly') {
			dataSeriesName = '일 생산량';
		} else if (periodType == 'Yearly') {
			dataSeriesName = '월 생산량';
		} else if (periodType == 'Daily') {
			dataSeriesName = '시 생산량';
		}
		barChartDataSeries = initDataSeries(chartProperties.wasmContext, {
			dataSeriesName,
			xValues: barChartData.x,
			yValues: barChartData.y
		});

		const barRenderableSeries = createColumnRenderableSeries(
			chartProperties.wasmContext,
			barChartDataSeries,
			{
				style: {
					strokeColor: '#2F63C9'
				}
			}
		);

		addChartRenderableSeries(chartProperties.sciChartSurface, barRenderableSeries);
		chartProperties.sciChartSurface.zoomExtents();
	}

	function updateLineChartData() {
		lineChartDataSeries = initDataSeries(chartProperties.wasmContext, {
			dataSeriesName: '주차 생산량',
			xValues: lineChartData?.x ?? [],
			yValues: lineChartData?.y ?? []
		});

		lineChartRenderableSeries = createLineRenderableSeries(
			chartProperties.wasmContext,
			lineChartDataSeries,
			{
				style: { strokeColor: 'lightblue', pointWidth: 4 }
			}
		);

		addChartRenderableSeries(chartProperties.sciChartSurface, lineChartRenderableSeries);
	}
</script>

<div class="h-full w-full p-2">
	<div id={chartSurfaceName} class="h-full w-full"></div>
</div>
