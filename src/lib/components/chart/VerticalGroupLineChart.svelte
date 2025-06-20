<script lang="ts">
	import { createLineRenderableSeries } from '$lib/scichart/chartTypes/line/lineChart';
	import type { ILineChartStyle } from '$lib/scichart/chartTypes/line/type';
	import { initializeChart } from '$lib/scichart/core/initializer';
	import { initDataSeries, addChartRenderableSeries } from '$lib/scichart/core/series';
	import type { IChartCommonParams } from '$lib/scichart/core/type';
	import {
		rolloverTooltipDataTemplate,
		addZoomAndDragModifier,
		showTooltipOnGraph
	} from '$lib/scichart/interactions/modifier';
	import dayjs from 'dayjs';
	import { SciChartVerticalGroup, RolloverModifier, XyDataSeries, Thickness } from 'scichart';
	import { onDestroy, onMount } from 'svelte';

	export let chartDatas: {
		chartName: string;
		dataSeriesName: string;
		legendPlacementDivId?: string;
		style: ILineChartStyle;
		xLabelType: 'time' | 'number';
		maxYValue: number;
		yLabelPrecision: number;
		time: number[];
		value: number[];
	}[];
	export let backgroundColor: string = '#191919';
	export let category: string | undefined = undefined;
	export let toolName: string | undefined = undefined;

	const modifierGroup = 'chartModifierGroup';
	let chartPropertiesArray: Array<IChartCommonParams>;
	let dataSeriesArray: Array<XyDataSeries>;
	let verticalGroup: SciChartVerticalGroup;

	//#region onMount
	onMount(async () => {
		const promiseChartProperties = chartDatas.map(
			async (
				{ chartName, dataSeriesName, yLabelPrecision, style, maxYValue, xLabelType, time, value },
				idx
			) => {
				let chartProperty = await initializeChart({
					chartSurfaceParam: {
						chartName,
						padding: new Thickness(4, 0, 2, -2),
						background: backgroundColor
					},
					xAxisParam: {
						autoTicksX: true,
						isAxisXVisible: idx === chartDatas.length - 1,
						gridLineColor: backgroundColor
							? { minor: backgroundColor, major: backgroundColor }
							: undefined
					},
					yAxisParam: {
						autoTicksY: true,
						yRange: [0, maxYValue * 1.5],
						padding: new Thickness(0, 2, 0, 6),
						yLabelPrecision,
						yGridLineColor: backgroundColor
							? { minor: backgroundColor, major: '#ffffff66' }
							: undefined
					}
				});

				// XAxis Label Format 설정
				if (xLabelType === 'time') {
					chartProperty.sciChartSurface.xAxes.get(0).labelProvider.formatLabel = (data) => {
						return dayjs(data * 1000)
							.subtract(9, 'h')
							.format('YYYY/MM/DD HH:mm:ss');
					};

					chartProperty.sciChartSurface.xAxes.get(0).labelProvider.formatCursorLabel = (data) => {
						return dayjs(data * 1000)
							.subtract(9, 'h')
							.format('YYYY/MM/DD HH:mm:ss');
					};
				}

				// DataSeries 추가
				if (!dataSeriesArray) dataSeriesArray = [];
				let dataSeries = initDataSeries(chartProperty.wasmContext, {
					dataSeriesName,
					xValues: time,
					yValues: value
				});
				dataSeriesArray.push(dataSeries);

				let renderableSeries = createLineRenderableSeries(chartProperty.wasmContext, dataSeries, {
					style,
					id: dataSeriesName
				});
				renderableSeries.rolloverModifierProps.tooltipDataTemplate = rolloverTooltipDataTemplate;
				renderableSeries.rolloverModifierProps.height = 25;

				addChartRenderableSeries(chartProperty.sciChartSurface, renderableSeries);
				chartProperty.sciChartSurface.zoomExtents();

				return chartProperty;
			}
		);

		chartPropertiesArray = await Promise.all(promiseChartProperties);

		verticalGroup = new SciChartVerticalGroup();

		chartPropertiesArray.forEach((chartProperty) => {
			// Vertical Group 에서 관리할 Surface 추가
			verticalGroup.addSurfaceToGroup(chartProperty.sciChartSurface);

			// Zoom & Drag Modifier 추가
			addZoomAndDragModifier(chartProperty.sciChartSurface, {
				modifierGroup
			});
			showTooltipOnGraph({
				surface: chartProperty.sciChartSurface,
				cursorModifierOptions: {
					showYLine: false,
					showTooltip: false,
					crosshairStroke: '#FFA500CC',
					tooltipTextStroke: 'white',
					tooltipContainerBackground: '#FFA500CC',
					modifierGroup
				}
			});
			// Rollover Modifier 추가
			chartProperty.sciChartSurface.chartModifiers.add(
				new RolloverModifier({
					rolloverLineStroke: 'white',
					rolloverLineStrokeThickness: 1,
					showRolloverLine: true,
					modifierGroup
				})
			);
		});
	});
	//#endregion

	//#region onDestroy
	onDestroy(() => {
		chartPropertiesArray.forEach((chartProperty) => {
			chartProperty.sciChartSurface?.delete();
		});
	});
	//#endregion
</script>

{#if chartDatas.length > 0}
	<div class="flex h-full w-full flex-col">
		{#each chartDatas as chartData}
			<section class="relative h-1/2 w-full">
				<h1 class="h-6 text-center text-gray-400 bg-[{backgroundColor}]">
					{category ?? ''}
					{chartData.dataSeriesName}
					<!-- category 가 '제품별'인 경우 공백 처리, 그 외의 경우 toolName 이 있을 때 () 안에 toolName 표시 -->
					{category == '제품별' ? '' : toolName ? `(${toolName})` : ''}
				</h1>
				<div id={chartData.chartName} class="h-[calc(100%-24px)] w-full"></div>
			</section>
		{/each}
	</div>
{/if}
