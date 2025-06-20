<script lang="ts">
	import { DpiHelper, FastColumnRenderableSeries, Thickness, type XyDataSeries } from 'scichart';
	import { onMount } from 'svelte';
	import { isDarkMode } from '../../../dashboard/provider/store';
	import { initializeChart } from '$lib/scichart/core/initializer';
	import { addTextAnnotation } from '$lib/scichart/interactions/annotation';
	import { createColumnRenderableSeries } from '$lib/scichart/chartTypes/column/columnChart';
	import { initDataSeries, addChartRenderableSeries } from '$lib/scichart/core/series';
	import { ColumnPaletteProvider } from '$lib/scichart/visuals/palette/columnPaletteProvider';
	import type { IColumnChartStyle } from '$lib/scichart/chartTypes/column/type';
	import type { IChartCommonParams } from '$lib/scichart/core/type';

	export let chartName: string;
	export let data: { time: number[]; value: number[]; dataSeriesName: string };
	export let style: IColumnChartStyle;
	export let xLabelString: string[];
	export let maxyRange: number;
	export let yAxisTitle: string | undefined = undefined;
	export let yAxisAlignment: 'Left' | 'Right' = 'Right';
	export let xHoverLabel: string | undefined = undefined;
	export let yHoverSuffix: string = '';
	export let thisHoverDataSeriesIndex: number | undefined = undefined;
	export let otherHoverDataSeriesIndex: number | undefined = undefined;

	//#region Variable
	let chartProperties: IChartCommonParams;
	let dataSeries: XyDataSeries;
	let renderableSeries: FastColumnRenderableSeries;
	//#endregion

	//#region Reactive
	// hover 된 Series Index가 변경되면,
	// 다른 Chart 상에 hover 된 값의 Data 표시 및 Highlight 처리
	$: if (otherHoverDataSeriesIndex !== undefined) {
		// Hover 된 Series Index에 대한 Text Annotation 추가 (Y 값)
		addTextAnnotation({
			chartSurface: chartProperties.sciChartSurface,
			fontColor: $isDarkMode ? '#35F0A5' : '#00663D',
			padding: [2, 8, 2, 8],
			fontSize: 12,
			text: `${renderableSeries.getDataSeriesName()}: ${
				renderableSeries.dataSeries.getNativeYValues().get(otherHoverDataSeriesIndex).toFixed(0) +
				yHoverSuffix
			}`,
			x1: 0.42,
			y1: 0.04,
			coordinateMode: 'Relative',
			id: 'textAnnotation'
		});

		// Hover 된 Series Index에 대한 Text Annotation 추가 (X 값)
		addTextAnnotation({
			chartSurface: chartProperties.sciChartSurface,
			fontColor: $isDarkMode ? '#35F0A5' : '#00663D',
			padding: [2, 2, 2, 8],
			fontSize: 12,
			text: `${xHoverLabel}: ${xLabelString[otherHoverDataSeriesIndex]}`,
			x1: 0.42,
			y1: 0.1,
			coordinateMode: 'Relative',
			id: 'textAnnotation'
		});

		// Hover 된 Series 색상 변경
		renderableSeries.paletteProvider = new ColumnPaletteProvider(
			otherHoverDataSeriesIndex,
			style.strokeColor
		);
	} else {
		if (chartProperties) {
			// Hover 해제 시, 기존 색상으로 변경
			renderableSeries.paletteProvider = new ColumnPaletteProvider(undefined, style.strokeColor);

			// Hover 해제 시, Text Annotation 제거
			chartProperties.sciChartSurface.annotations.clear();
		}
	}

	$: {
		if (chartProperties) {
			dataSeries = initDataSeries(chartProperties.wasmContext, {
				dataSeriesName: data.dataSeriesName,
				xValues: data.time,
				yValues: data.value
			});

			if (chartProperties.sciChartSurface.renderableSeries.size() > 0) {
				chartProperties.sciChartSurface.renderableSeries.get(0).dataSeries = dataSeries;
			}
		}
	}

	// hover 된 Series Highlight 처리
	$: if (thisHoverDataSeriesIndex !== undefined) {
		// Hover 된 Series Index에 대한 Text Annotation 추가 (Y 값)
		addTextAnnotation({
			chartSurface: chartProperties.sciChartSurface,
			fontColor: $isDarkMode ? '#35F0A5' : '#00663D',
			padding: [2, 8, 2, 8],
			fontSize: 12,
			text: `${renderableSeries.getDataSeriesName()}: ${
				renderableSeries.dataSeries.getNativeYValues().get(thisHoverDataSeriesIndex).toFixed(0) +
				yHoverSuffix
			}`,
			x1: 0.42,
			y1: 0.04,
			coordinateMode: 'Relative',
			id: 'textAnnotation'
		});

		// Hover 된 Series Index에 대한 Text Annotation 추가 (X 값)
		addTextAnnotation({
			chartSurface: chartProperties.sciChartSurface,
			fontColor: $isDarkMode ? '#35F0A5' : '#00663D',
			padding: [2, 2, 2, 8],
			fontSize: 12,
			text: `${xHoverLabel}: ${xLabelString[thisHoverDataSeriesIndex]}`,
			x1: 0.42,
			y1: 0.1,
			coordinateMode: 'Relative',
			id: 'textAnnotation'
		});

		// 다른 Series Hover 시, 해당 Series 색상 변경
		renderableSeries.paletteProvider = new ColumnPaletteProvider(
			thisHoverDataSeriesIndex,
			style.strokeColor
		);
	} else {
		// 다른 Series Hover 해제 시, 기존 색상으로 변경
		if (chartProperties) {
			renderableSeries.paletteProvider = new ColumnPaletteProvider(undefined, style.strokeColor);
		}

		if (chartProperties && otherHoverDataSeriesIndex === undefined) {
			// Hover 해제 시, Text Annotation 제거
			chartProperties.sciChartSurface.annotations.clear();
		}
	}
	//#endregion

	//#region onMount
	onMount(async () => {
		// Chart 초기화
		chartProperties = await initializeChart({
			chartSurfaceParam: {
				chartName,
				padding: new Thickness(8, 5, 2, 4)
			},
			xAxisParam: {
				xValues: data.time,
				isAxisXVisible: true,
				xLabelString: xLabelString
			},

			yAxisParam: {
				yValues: data.value,
				yRange: [0, maxyRange],
				isInnerAxis: false,
				yAxisTitle: yAxisTitle,
				axisAlignment: yAxisAlignment
			}
		});

		// Data Series 초기화
		dataSeries = initDataSeries(chartProperties.wasmContext, {
			dataSeriesName: data.dataSeriesName,
			xValues: data.time,
			yValues: data.value
		});

		// Renderable Series 초기화
		renderableSeries = createColumnRenderableSeries(chartProperties.wasmContext, dataSeries, {
			style
		});

		// Renderable Series 추가
		addChartRenderableSeries(chartProperties.sciChartSurface, renderableSeries);

		// 초기 로드 시 화면 자동으로 맞춤
		chartProperties.sciChartSurface.zoomExtents();

		// 마우스 Hover 이벤트 추가
		chartProperties.sciChartSurface.domCanvas2D.addEventListener('mousemove', (mouseEvent) => {
			const premultipliedX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
			const premultipliedY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
			// IHitTestProvider.hitTest
			const hitTestInfo = renderableSeries.hitTestProvider.hitTest(premultipliedX, premultipliedY);

			// 현재 hover 된 Series Index 저장
			if (hitTestInfo.isHit) {
				thisHoverDataSeriesIndex = hitTestInfo.dataSeriesIndex;
			}
			// Series Hover 해제
			else {
				thisHoverDataSeriesIndex = undefined;
			}
		});

		// 마우스가 차트 영역을 벗어날 경우, 다른 Series Hover 해제
		chartProperties.sciChartSurface.domCanvas2D.addEventListener('mouseleave', () => {
			thisHoverDataSeriesIndex = undefined;
		});
	});
</script>

<div class="h-full w-full">
	<div id={chartName} class="m-auto h-full w-[98%]" />
</div>
