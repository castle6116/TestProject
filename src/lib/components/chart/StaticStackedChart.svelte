<script lang="ts">
	import {
		DpiHelper,
		FastLineRenderableSeries,
		HitTestInfo,
		StackedColumnCollection,
		Thickness,
		XyDataSeries
	} from 'scichart';
	import { onDestroy, onMount } from 'svelte';
	import { isDarkMode } from '../../../dashboard/provider/store';
	import { initializeChart } from '$lib/scichart/core/initializer';
	import { createNumericYAxis } from '$lib/scichart/axes/axis';
	import { drawStackedColumnSeries } from '$lib/scichart/chartTypes/column/stackedColumnChart';
	import { createLineRenderableSeries } from '$lib/scichart/chartTypes/line/lineChart';
	import { showTooltipOnGraph, addLegendModifier } from '$lib/scichart/interactions/modifier';
	import { initDataSeries, addChartRenderableSeries } from '$lib/scichart/core/series';
	import { CustomRightAlignedOuterVerticallyStackedAxisLayoutStrategy } from '$lib/scichart/visuals/strategies/customAxisLayoutStrategy';
	import type { IChartCommonParams } from '$lib/scichart/core/type';
	import type {
		IStackedColumnChartData,
		IStackedColumnChartStyle
	} from '$lib/scichart/chartTypes/column/type';

	export let chartName: string;
	export let dataName: string[];
	export let xLabelString: string[];
	export let stackedChartData: IStackedColumnChartData;
	export let lineChartData: { x: number[]; y: number[] }[] | undefined = undefined;
	export let lineChartMaxYValue: number | undefined = undefined;
	export let lineChartDataSeriesNameSuffix: string = '';
	export let style: IStackedColumnChartStyle;
	export let legend: string;
	export let maxyRange: number = 500;
	export let yAxisAlignment: 'Left' | 'Right' = 'Right';
	export let yLabelAlignment: 'Left' | 'Right' = 'Right';
	export let yAxisTitle: string | undefined = undefined;
	export let yHoverSuffix: string = '';
	export let yLabelSuffix: string = '';
	export let yLabelSuffixAfterSort: 'odd' | 'even' = 'even';
	export let chartAboveFontSize: number = 12;

	let chartProperties: IChartCommonParams;
	let lineChartDataSeriesArray: XyDataSeries[] | undefined = [];
	let lineChartRenderableSeriesArray: FastLineRenderableSeries[] | undefined = [];
	let stackedChartHitTestResults: HitTestInfo[];
	let lineChartHitTestResults: HitTestInfo[];

	onMount(async () => {
		chartProperties = await initializeChart({
			chartSurfaceParam: {
				chartName,
				padding: new Thickness(10, 5, 0, 5)
			},
			xAxisParam: {
				xLabelString: xLabelString
			},
			yAxisParam: {
				yRange: [0, maxyRange],
				labelAlignment: yLabelAlignment,
				axisAlignment: yAxisAlignment,
				yAxisTitle: yAxisTitle,
				padding: new Thickness(0, 2, 0, 6),
				stackedAxisLength: '65%'
			}
		});

		drawStackedColumnSeries({
			sciChartParams: chartProperties,
			style: { ...style, fontSize: chartAboveFontSize },
			dataSeriesName: dataName,
			chartData: stackedChartData,
			id: 'StackedColumnChart'
		});

		// Line Chart Data가 존재할 경우 Line Chart 추가
		if (lineChartData) {
			chartProperties.sciChartSurface.yAxes.add(
				createNumericYAxis(chartProperties.wasmContext, {
					axisAlignment: yLabelAlignment,
					labelAlignment: yLabelAlignment,
					axisId: 'LineChart_YAxis',
					yLabelPrecision: 0,
					axisBorder: { borderBottom: 20 },
					yRange: [0, lineChartMaxYValue ?? 100],
					stackedAxisLength: '30%'
				})
			);

			dataName?.forEach((dataSeriesName, idx) => {
				const lineDataSeries = initDataSeries(chartProperties.wasmContext, {
					xValues: lineChartData[idx].x,
					yValues: lineChartData[idx].y,
					dataSeriesName: `${dataSeriesName} ${lineChartDataSeriesNameSuffix}`
				});

				const lineRenderableSeries = createLineRenderableSeries(
					chartProperties.wasmContext,
					lineDataSeries,
					{
						style: {
							strokeColor: style.strokeColor[idx],
							thickness: 2,
							pointWidth: 5
						},
						yAxisId: 'LineChart_YAxis',
						id: `${dataSeriesName} ${lineChartDataSeriesNameSuffix}`
					}
				);
				lineChartDataSeriesArray.push(lineDataSeries);
				lineChartRenderableSeriesArray.push(lineRenderableSeries);
				addChartRenderableSeries(chartProperties.sciChartSurface, lineRenderableSeries);
			});

			chartProperties.sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
				new CustomRightAlignedOuterVerticallyStackedAxisLayoutStrategy();
		}

		// Zoom & Drag Modifier 추가
		// addZoomAndDragModifier(chartProperties.sciChartSurface);

		showTooltipOnGraph({
			surface: chartProperties.sciChartSurface,
			cursorModifierOptions: {
				crosshairStrokeThickness: 0,
				tooltipTextStroke: $isDarkMode ? '#35F0A5' : '#00663D',
				tooltipContainerBackground: $isDarkMode ? '#183126' : '#E2F2E9'
			},
			replaceHoverData: {
				yValueSuffix: yHoverSuffix,
				yLabelSuffix,
				yLabelSuffixAfterSort
			},
			options: {
				isSort: true,
				flattenCount: 2
			}
		});

		addLegendModifier({
			chartSurface: chartProperties.sciChartSurface,
			placementDivId: legend,
			excludeRenderableSeries: [...lineChartRenderableSeriesArray],
			isCheckedChagedCallback: (renderableSeries, isChecked) => {
				const renderableSeriesId = `${renderableSeries.getDataSeriesName()} ${lineChartDataSeriesNameSuffix}`;
				if (!isChecked) {
					chartProperties.sciChartSurface.renderableSeries.getById(renderableSeriesId).isVisible =
						false;
				} else {
					chartProperties.sciChartSurface.renderableSeries.getById(renderableSeriesId).isVisible =
						true;
				}
			}
		});

		// 초기 로드 시 화면 자동으로 맞춤
		chartProperties.sciChartSurface.zoomExtents();

		// 마우스 Hover 이벤트 추가
		chartProperties.sciChartSurface.domCanvas2D.addEventListener('mousemove', (mouseEvent) => {
			// 마우스 이벤트 발생 위치를 DPI에 맞게 변환
			const premultipliedX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
			const premultipliedY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;

			//#region Stacked Column Chart Hit Test
			// Stacked Column Collection 가져오기
			const stackedColumnCollection = (
				chartProperties.sciChartSurface.renderableSeries.get(0) as StackedColumnCollection
			).asArray();

			// 각 Column 별로 Hit Test 수행
			stackedChartHitTestResults = stackedColumnCollection.reduce(
				(acc, stackedColumnRenderableSeries) => {
					const hitTestInfo: HitTestInfo = stackedColumnRenderableSeries.hitTestProvider.hitTest(
						premultipliedX,
						premultipliedY
					);
					acc.push(hitTestInfo);
					return acc;
				},
				[] as HitTestInfo[]
			);

			// HIT 이 하나라도 되었을 경우 해당 Column Highlight 처리
			if (stackedChartHitTestResults.some((hitTestInfo) => hitTestInfo.isHit)) {
				stackedChartHitTestResults.forEach((hitTestInfo, idx) => {
					// HIT 된 Column의 Opacity를 1로 변경
					if (hitTestInfo.isHit) {
						stackedColumnCollection[idx].opacity = 1;
						lineChartRenderableSeriesArray[idx].opacity = 1;
						lineChartRenderableSeriesArray[idx].pointMarker!.opacity = 1;
					}
					// HIT 되지 않은 Column의 Opacity를 0.4로 변경
					else {
						stackedColumnCollection[idx].opacity = 0.4;
						lineChartRenderableSeriesArray[idx].opacity = 0.4;
						lineChartRenderableSeriesArray[idx].pointMarker!.opacity = 0.4;
					}
				});
				return;
			}
			// HIT 이 하나도 안되었을 경우 전체 Column의 Opacity를 원상태로 변경
			else {
				stackedColumnCollection.forEach((stackedColumnRenderableSeries) => {
					stackedColumnRenderableSeries.opacity = 0.8;
				});

				lineChartRenderableSeriesArray.forEach((lineChartRenderableSeries) => {
					lineChartRenderableSeries.opacity = 1;
					lineChartRenderableSeries.pointMarker!.opacity = 1;
				});
			}
			//#endregion

			//#region Line Chart Hit Test
			lineChartHitTestResults = lineChartRenderableSeriesArray.reduce(
				(acc, lineChartRenderableSeries) => {
					const hitTestInfo: HitTestInfo = lineChartRenderableSeries.hitTestProvider.hitTest(
						premultipliedX,
						premultipliedY
					);
					acc.push(hitTestInfo);
					return acc;
				},
				[] as HitTestInfo[]
			);

			// Hit 이 하나라도 되었을 경우 해당 Line Chart Highlight 처리
			if (lineChartHitTestResults.some((hitTestInfo) => hitTestInfo.isHit)) {
				lineChartHitTestResults.forEach((hitTestInfo, idx) => {
					if (hitTestInfo.isHit) {
						lineChartRenderableSeriesArray[idx].opacity = 1;
						lineChartRenderableSeriesArray[idx].pointMarker!.opacity = 1;
						stackedColumnCollection[idx].opacity = 1;
					} else {
						lineChartRenderableSeriesArray[idx].opacity = 0.4;
						lineChartRenderableSeriesArray[idx].pointMarker!.opacity = 0.4;
						stackedColumnCollection[idx].opacity = 0.4;
					}
				});
				return;
			}
			// Hit 이 하나도 안되었을 경우 전체 Line Chart의 Opacity를 원상태로 변경
			else {
				lineChartRenderableSeriesArray.forEach((lineChartRenderableSeries) => {
					lineChartRenderableSeries.opacity = 1;
					lineChartRenderableSeries.pointMarker!.opacity = 1;
				});

				stackedColumnCollection.forEach((stackedColumnRenderableSeries) => {
					stackedColumnRenderableSeries.opacity = 0.8;
				});
			}
			//#endregion
		});

		// 마우스 Click 이벤트 추가
		chartProperties.sciChartSurface.domCanvas2D.addEventListener('click', () => {
			const stackedColumnCollection = (
				chartProperties.sciChartSurface.renderableSeries.get(0) as StackedColumnCollection
			).asArray();

			// HIT 이 하나라도 되었을 경우와 아직 Click 하지 않았을 경우일 때
			//#region Stacked Column Click Event
			// 해당 Column Click 이벤트 발생
			if (
				stackedChartHitTestResults.some((hitTestInfo) => hitTestInfo.isHit) &&
				stackedColumnCollection.every((stackedColumn) => stackedColumn.isVisible)
			) {
				stackedChartHitTestResults.forEach((hitTestInfo, idx) => {
					// HIT 되지 않은 Column을 숨김
					stackedColumnCollection[idx].isVisible = false;
					lineChartRenderableSeriesArray[idx].isVisible = false;
					// HIT 된 Column을 보이게 변경
					if (hitTestInfo.isHit) {
						stackedColumnCollection[idx].isVisible = true;
						lineChartRenderableSeriesArray[idx].isVisible = true;
					}
				});
				return;
			}
			// HIT 이 하나도 안되었을 경우 전체 Column을 보이게 변경
			else {
				stackedColumnCollection.forEach((stackedColumnRenderableSeries) => {
					stackedColumnRenderableSeries.isVisible = true;
				});

				lineChartRenderableSeriesArray.forEach((lineChartRenderableSeries) => {
					lineChartRenderableSeries.isVisible = true;
				});
			}
			//#endregion

			//#region Line Chart Click Event
			if (
				lineChartHitTestResults.some((hitTestInfo) => hitTestInfo.isHit) &&
				lineChartRenderableSeriesArray.every((renderableSeries) => renderableSeries.isVisible)
			) {
				lineChartHitTestResults.forEach((hitTestInfo, idx) => {
					stackedColumnCollection[idx].isVisible = false;
					lineChartRenderableSeriesArray[idx].isVisible = false;
					if (hitTestInfo.isHit) {
						lineChartRenderableSeriesArray[idx].isVisible = true;
						stackedColumnCollection[idx].isVisible = true;
					}
				});
				return;
			} else {
				stackedColumnCollection.forEach((stackedColumnRenderableSeries) => {
					stackedColumnRenderableSeries.isVisible = true;
				});

				lineChartRenderableSeriesArray.forEach((lineChartRenderableSeries) => {
					lineChartRenderableSeries.isVisible = true;
				});
			}
			//#endregion
		});
	});

	onDestroy(() => {
		chartProperties?.sciChartSurface?.delete();
	});
</script>

<!-- svelte-ignore missing-declaration -->
<div class="h-full w-full">
	<div id={chartName} class="m-auto h-full w-[98%]" />
</div>
