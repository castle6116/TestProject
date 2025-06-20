<script lang="ts">
	import dayjs from 'dayjs';
	import { Thickness, RolloverModifier, type XyDataSeries, LegendModifier } from 'scichart';
	import { onMount } from 'svelte';
	import { initializeChart } from '$lib/scichart/core/initializer';
	import { createNumericYAxis } from '$lib/scichart/axes/axis';
	import { createLineRenderableSeries } from '$lib/scichart/chartTypes/line/lineChart';
	import { initDataSeries, addChartRenderableSeries } from '$lib/scichart/core/series';
	import {
		rolloverTooltipDataTemplate,
		addLegendModifier,
		addZoomAndDragModifier
	} from '$lib/scichart/interactions/modifier';
	import type { ILineChartStyle } from '$lib/scichart/chartTypes/line/type';
	import type { IChartCommonParams } from '$lib/scichart/core/type';

	export let chartName: string;
	export let legendPlacementDivId: string;
	export let backgroundColor: string = '#191919';
	export let xLabelType: 'time' | 'number' = 'time';
	export let multipleYAxis:
		| Array<{ yAxisId: string; axisAlignment: 'Left' | 'Right'; maxYValue: number }>
		| undefined = undefined;
	export let maxYValue: number;
	export let data: { time: number[]; value: number[]; dataSeriesName: string }[];
	export let style: ILineChartStyle[];

	//#region Variable
	let chartProperties: IChartCommonParams;
	let dataSeries: XyDataSeries[];
	let legendModifier: LegendModifier;
	//#endregion

	//#region onMount
	onMount(async () => {
		// Chart 초기화
		chartProperties = await initializeChart({
			chartSurfaceParam: {
				chartName,
				padding: new Thickness(4, 0, 2, -2),
				background: backgroundColor
			},
			xAxisParam: {
				autoTicksX: true,
				gridLineColor: backgroundColor
					? { minor: backgroundColor, major: backgroundColor }
					: undefined
			},
			yAxisParam: {
				autoTicksY: true,
				yRange: [0, maxYValue * 1.2],
				padding: new Thickness(0, 2, 0, 6),
				yGridLineColor: backgroundColor ? { minor: backgroundColor, major: '#ffffff66' } : undefined
			}
		});

		// XAxis Label Format 설정
		if (xLabelType === 'time') {
			chartProperties.sciChartSurface.xAxes.get(0).labelProvider.formatLabel = (data) => {
				return dayjs(data * 1000)
					.subtract(9, 'h')
					.format('YYYY/MM/DD HH:mm:ss');
			};
		}

		// YAxis 추가
		if (multipleYAxis) {
			multipleYAxis.forEach((yAxisData) => {
				chartProperties.sciChartSurface.yAxes.add(
					createNumericYAxis(chartProperties.wasmContext, {
						axisAlignment: yAxisData?.axisAlignment,
						axisId: yAxisData?.yAxisId,
						yRange: [0, (yAxisData?.maxYValue ?? 0) * 1.5]
					})
				);
			});
		}

		// Data Series 초기화
		dataSeries = data.map((d) =>
			initDataSeries(chartProperties.wasmContext, {
				dataSeriesName: d.dataSeriesName,
				xValues: d.time,
				yValues: d.value
			})
		);

		// Renderable Series 초기화
		dataSeries.forEach((ds, idx) => {
			// multipleYAxis 로 받은 데이터는 새로 추가된 Axis 에 그리고, 그 외의 경우는 기존의 y축을 사용
			let yAxisId =
				data.length - idx - 1 > 0 && multipleYAxis ? multipleYAxis[idx]?.yAxisId : undefined;
			const renderableSeries = createLineRenderableSeries(chartProperties.wasmContext, ds, {
				style: style[idx],
				yAxisId: yAxisId
			});
			renderableSeries.rolloverModifierProps.tooltipDataTemplate = rolloverTooltipDataTemplate;
			renderableSeries.rolloverModifierProps.height = 25;

			// Renderable Series 추가
			addChartRenderableSeries(chartProperties.sciChartSurface, renderableSeries);
		});

		//#region Modifier 추가
		legendModifier = addLegendModifier({
			chartSurface: chartProperties.sciChartSurface,
			placementDivId: legendPlacementDivId
		});

		chartProperties.sciChartSurface.chartModifiers.add(
			new RolloverModifier({
				rolloverLineStroke: '#FF660066'
			})
		);

		addZoomAndDragModifier(chartProperties.sciChartSurface);

		// 초기 로드 시 화면 자동으로 맞춤
		chartProperties.sciChartSurface.zoomExtents();
	});
</script>

<div class="h-full w-full">
	<div id={chartName} class="m-auto h-full w-[98%]" />
</div>
