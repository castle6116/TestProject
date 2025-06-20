<script lang="ts">
	import dayjs from 'dayjs';
	import {
		NumberRange,
		NumericAxis,
		SciChartVerticalGroup,
		TextAnnotation,
		VisibleRangeChangedArgs,
		XyDataSeries
	} from 'scichart';
	import { onDestroy, onMount } from 'svelte';
	import { loadLineStyle, lossLineStyle, predictLineStyle } from '$lib/components/chart/chart';
	import { isDarkMode } from '$dashboard/provider/store';
	import { initializeChart } from '$lib/scichart/core/initializer';
	import { addChartRenderableSeries, initDataSeries } from '$lib/scichart/core/series';
	import { createLineRenderableSeries } from '$lib/scichart/chartTypes/line/lineChart';
	import { createMountainRenderableSeries } from '$lib/scichart/chartTypes/line/mountainChart';
	import {
		addLegendModifier,
		addZoomAndDragModifier,
		showTooltipOnGraph
	} from '$lib/scichart/interactions/modifier';
	import type { IChartCommonParams } from '$lib/scichart/core/type';
	import {
		addTextAnnotation,
		addArrowDownAnnotation,
		addLineAnnotation,
		addWarningIconAnnotation
	} from '$lib/scichart/interactions/annotation';

	// TODO: Config로 추출
	// 필수 Props
	export let chartNames: string[];
	export let dataSource:
		| { time: number[]; load: number[]; predict: number[]; loss: number[]; productNo?: string }
		| undefined;
	export let isRealTime: boolean;

	// 선택 Props
	export let fifoCapacity: number | undefined = undefined; // For RealTime
	export let upperXAxis: NumericAxis | undefined = undefined;
	export let legendPlacementDivId: string | undefined = undefined;
	export let alarmTimeInfo: { startTime: string; endTime: string } | undefined = undefined;
	export let toolStartInfo: { toolCode: string; startTime: number; value: number } | undefined =
		undefined;
	export let isZoom: boolean = false;
	export let backgroundColor: string = '#191919';
	export let isLowerYAxisVisible: boolean = true;
	export let yAxisAlignment: 'Left' | 'Right' = 'Left';
	export let yLabelAlignment: 'Left' | 'Right' = 'Left';
	export let autoTicksY: boolean = false;
	export let isTooltipActive: boolean = false;
	export let xLabelPrefix: string | undefined = undefined;
	export let isInnerYUpperAxis: boolean = true;
	export let isInnerYLowerAxis: boolean = true;
	export let isShowProductNoAnnotation: boolean = false;
	export let currentRefreshTime: string | undefined = undefined;

	//#region Variable
	// Chart Ready Status
	let isReady: boolean = false;

	// Properties
	let upperChartProperties: IChartCommonParams;
	let lowerChartProperties: IChartCommonParams;

	// TODO: Config 추출 혹은 초기 데이터 로드시 설정
	let yRange: number[] = [0, 50000];
	let upperYAxis: NumericAxis;
	let lowerXAxis: NumericAxis;

	// Data Series
	let upperLoadDataSeries: XyDataSeries;
	let upperPredictDataSeries: XyDataSeries;
	let upperLossDataSeries: XyDataSeries;
	let lowerLossDataSeries: XyDataSeries;

	// Code
	let currentTcode: string;
	//#endregion

	//#region Reactive
	$: {
		// Append Data
		if (isRealTime && isReady && dataSource) {
			updateRealTimeData(dataSource);
		} else if (!isRealTime && isReady && dataSource) {
			updateStaticData(dataSource);
		}
		// dataSource 초기화
		if (isReady && dataSource) {
			dataSource = undefined;
		}
	}

	// 실시간 차트 알람 정보 추가
	$: {
		if (isRealTime && alarmTimeInfo) {
			addAlarmAnnotation(alarmTimeInfo.startTime, alarmTimeInfo.endTime);
		}
	}

	$: {
		if (isRealTime && toolStartInfo) {
			addTCodeAnnotation({
				nextTcode: toolStartInfo.toolCode,
				x1: toolStartInfo.startTime,
				y1: toolStartInfo.value
			});
		}
	}

	$: {
		if (currentRefreshTime) {
			// convert to number
			currentRefreshTime = currentRefreshTime.replace('m', '');
		}
	}

	//#endregion

	// ProductNo Annotation 테마 적용
	$: {
		if (isReady) {
			if (upperChartProperties.sciChartSurface.annotations.getById('RealTimeProductNoAnnotation')) {
				const productNoAnnotation = upperChartProperties.sciChartSurface.annotations.getById(
					'RealTimeProductNoAnnotation'
				) as TextAnnotation;

				if ($isDarkMode) {
					productNoAnnotation.textColor = 'white';
				} else {
					productNoAnnotation.textColor = 'black';
				}
			}
		}
	}

	//#region onMount
	onMount(async () => {
		await initializeCharts();
		isReady = true;
	});
	//#endregion

	//#region onDestroy
	onDestroy(() => {
		isReady = false;
		upperChartProperties.sciChartSurface.delete();
		lowerChartProperties.sciChartSurface.delete();
	});
	//#endregion

	//#region Function
	async function initializeCharts() {
		const verticalGroup = new SciChartVerticalGroup();
		//#region Chart 초기화
		upperChartProperties = await initializeChart(
			{
				chartSurfaceParam: {
					chartName: chartNames[0],
					isDrawBehind: false,
					background: backgroundColor
				},
				xAxisParam: {
					autoTicksX: true,
					labelPrefix: xLabelPrefix,
					gridLineColor: backgroundColor
						? { minor: backgroundColor, major: backgroundColor }
						: undefined
				},
				yAxisParam: {
					yRange: yRange,
					autoTicksY: autoTicksY,
					isInnerAxis: isInnerYUpperAxis,
					axisAlignment: yAxisAlignment,
					labelAlignment: yLabelAlignment,
					yGridLineColor: backgroundColor
						? { minor: backgroundColor, major: backgroundColor }
						: undefined
				}
			},
			true
		);

		lowerChartProperties = await initializeChart({
			chartSurfaceParam: {
				chartName: chartNames[1],
				isDrawBehind: false,
				background: backgroundColor
			},
			xAxisParam: {
				isAxisXVisible: false,
				gridLineColor: backgroundColor
					? { minor: backgroundColor, major: backgroundColor }
					: undefined
			},
			yAxisParam: {
				yRange: [0, 1],
				autoTicksY: false,
				majorDelta: 1,
				isInnerAxis: isInnerYLowerAxis,
				axisAlignment: yAxisAlignment,
				isAxisYVisible: isLowerYAxisVisible,
				labelAlignment: yLabelAlignment,
				yGridLineColor: backgroundColor
					? { minor: backgroundColor, major: backgroundColor }
					: undefined
			}
		});

		verticalGroup.addSurfaceToGroup(upperChartProperties.sciChartSurface);
		verticalGroup.addSurfaceToGroup(lowerChartProperties.sciChartSurface);
		//#endregion

		//#region Data Series 초기화
		upperLoadDataSeries = initDataSeries(upperChartProperties.wasmContext, {
			dataSeriesName: '실측',
			fifoCapacity
		});

		upperPredictDataSeries = initDataSeries(upperChartProperties.wasmContext, {
			dataSeriesName: 'AI',
			fifoCapacity
		});

		lowerLossDataSeries = initDataSeries(lowerChartProperties.wasmContext, {
			dataSeriesName: 'LowerLoss',
			fifoCapacity
		});

		upperLossDataSeries = initDataSeries(upperChartProperties.wasmContext, {
			dataSeriesName: 'Loss',
			fifoCapacity
		});
		//#endregion

		//#region Renderable Series 초기화
		const loadRenderableSeries = createLineRenderableSeries(
			upperChartProperties.wasmContext,
			upperLoadDataSeries,
			{ style: loadLineStyle }
		);

		const predictRenderableSeries = createLineRenderableSeries(
			upperChartProperties.wasmContext,
			upperPredictDataSeries,
			{ style: predictLineStyle }
		);
		const upperLossRenderableSeries = createMountainRenderableSeries(
			upperChartProperties.wasmContext,
			upperLossDataSeries,
			{
				style: { ...lossLineStyle, strokeColor: backgroundColor! }
			}
		);
		const lossRenderableSeries = createMountainRenderableSeries(
			lowerChartProperties.wasmContext,
			lowerLossDataSeries,
			{
				style: lossLineStyle,
				isStepLine: true
			}
		);
		//#endregion

		//#region Renderable Series 추가
		addChartRenderableSeries(upperChartProperties.sciChartSurface, loadRenderableSeries);
		addChartRenderableSeries(upperChartProperties.sciChartSurface, predictRenderableSeries);
		addChartRenderableSeries(upperChartProperties.sciChartSurface, upperLossRenderableSeries);
		addChartRenderableSeries(lowerChartProperties.sciChartSurface, lossRenderableSeries);
		//#endregion

		//#region Axis 할당
		upperXAxis = upperChartProperties.sciChartSurface.xAxes.get(0) as NumericAxis;
		upperYAxis = upperChartProperties.sciChartSurface.yAxes.get(0) as NumericAxis;
		lowerXAxis = lowerChartProperties.sciChartSurface.xAxes.get(0) as NumericAxis;
		//#endregion

		//#region Modifier 추가
		addLegendModifier({
			chartSurface: upperChartProperties.sciChartSurface,
			placementDivId: legendPlacementDivId,
			excludeRenderableSeries: [upperLossRenderableSeries]
		});

		// Static Chart 일 경우, Zoom & Drag Modifier 추가
		if (!isRealTime) {
			addZoomAndDragModifier(upperChartProperties.sciChartSurface);
			addZoomAndDragModifier(lowerChartProperties.sciChartSurface);
		}

		// Tooltip 활성화
		if (isTooltipActive) {
			showTooltipOnGraph({
				surface: upperChartProperties.sciChartSurface,
				replaceHoverData: {
					xLabel: 'Date',
					yLabel: ['실측', 'AI', '오차율'],
					yValuePrecision: 2
				},
				cursorModifierOptions: {
					crosshairStrokeThickness: 0,
					tooltipTextStroke: $isDarkMode ? 'white' : '#000000',
					tooltipContainerBackground: $isDarkMode ? '#000000' : '#F4F4F4'
				}
			});
		}

		// Add TextAnnotation
		if (isShowProductNoAnnotation) {
			addTextAnnotation({
				chartSurface: upperChartProperties.sciChartSurface,
				id: 'RealTimeProductNoAnnotation',
				x1: 0.45,
				y1: 0,
				coordinateMode: 'Relative',
				text: dataSource?.productNo || 'N/A',
				fontColor: $isDarkMode ? 'white' : 'black',
				fontSize: 12
			});
		}

		//#endregion

		//#region Syncronize Visible Range
		// lowerXAxis subscribe to upperXAxis
		lowerXAxis.visibleRangeChanged.subscribe((lowerX) => {
			upperXAxis!.visibleRange = lowerX!.visibleRange;

			// Static Chart 일 경우, Zoom 여부 판단
			if (!isRealTime) {
				// 현재 VisibleRange가 RefreshTime * 60 - 5 보다 작으면 Zoom 상태
				if (upperXAxis!.visibleRange.diff < Number(currentRefreshTime) * 60 - 5) {
					isZoom = true;
				}
				// 그렇지 않으면 Zoom 원래 상태
				else {
					isZoom = false;
				}
			}
		});

		// upperXAxis subscribe to lowerXAxis
		upperXAxis.visibleRangeChanged.subscribe((upperX) => {
			lowerXAxis.visibleRange = upperX!.visibleRange;
		});

		upperYAxis.visibleRangeChanged.subscribe((upperY: VisibleRangeChangedArgs | undefined) => {
			isZoom = upperY?.visibleRange.max != yRange[1];
		});
		//#endregion
	}

	// RealTime Data 업데이트
	function updateRealTimeData(dataSource: {
		time: number[];
		load: number[];
		predict: number[];
		loss: number[];
		productNo?: string;
	}) {
		upperLoadDataSeries.appendRange(dataSource.time, dataSource.load);
		upperPredictDataSeries.appendRange(dataSource.time, dataSource.predict);
		lowerLossDataSeries.appendRange(dataSource.time, dataSource.loss);

		// Product No Annotation 업데이트
		if (upperChartProperties.sciChartSurface.annotations.getById('RealTimeProductNoAnnotation')) {
			const productNoAnnotation = upperChartProperties.sciChartSurface.annotations.getById(
				'RealTimeProductNoAnnotation'
			) as TextAnnotation;

			productNoAnnotation.text = dataSource.productNo || 'N/A';
		}
	}
	// Static Data 업데이트
	function updateStaticData(dataSource: {
		time: number[];
		load: number[];
		predict: number[];
		loss: number[];
	}) {
		isReady = false;
		// Data Series Clear
		upperLoadDataSeries.clear();
		upperPredictDataSeries.clear();
		upperLossDataSeries.clear();
		lowerLossDataSeries.clear();

		// Append Data
		upperLoadDataSeries.appendRange(dataSource.time, dataSource.load);
		upperPredictDataSeries.appendRange(dataSource.time, dataSource.predict);
		upperLossDataSeries.appendRange(dataSource.time, dataSource.loss);
		lowerLossDataSeries.appendRange(dataSource.time, dataSource.loss);

		// VisibleRange 설정
		upperXAxis!.visibleRange = new NumberRange(
			dataSource.time[0],
			dataSource.time[dataSource.time.length - 1]
		);
		upperYAxis!.visibleRange = new NumberRange(yRange[0], yRange[1]);

		// 알람 정보 추가
		if (alarmTimeInfo) {
			addAlarmAnnotation(alarmTimeInfo.startTime, alarmTimeInfo.endTime, true);
		}

		isReady = true;
	}

	// Tcode Annotation 추가 함수
	function addTCodeAnnotation({
		nextTcode,
		x1,
		y1
	}: {
		nextTcode: string;
		x1: number;
		y1: number;
	}) {
		//if (nextTcode !== currentTcode) {
		currentTcode = nextTcode;
		addTextAnnotation({
			chartSurface: upperChartProperties.sciChartSurface,
			id: 'tcodeAnnotation',
			x1: x1 - 2.5,
			y1: y1 + 5000,
			text: currentTcode,
			fontColor: '#A8A8A8',
			fontWeight: 'bold',
			fontSize: 8
		});
		addArrowDownAnnotation({
			chartSurface: upperChartProperties.sciChartSurface,
			id: 'arrowDownAnnotation',
			x1: x1,
			y1: y1 + 5000,
			baseColor: '#A8A8A8',
			direction: 'left'
		});
	}

	// Alarm Annotation 추가 함수
	function addAlarmAnnotation(startTime: string, endTime: string, isStaticChart: boolean = false) {
		let startTimestamp = dayjs(startTime).toDate().getTime() / 1_000 + 9 * 60 * 60;
		let endTimestamp = dayjs(endTime).toDate().getTime() / 1_000 + 9 * 60 * 60;

		// Line Annotation 표시
		try {
			let yValues = upperPredictDataSeries.getNativeYValues();
			let beginIdx = upperPredictDataSeries.findIndex(startTimestamp);
			let endIdx = upperPredictDataSeries.findIndex(endTimestamp);

			let beginY = yValues.get(beginIdx);
			let endY = yValues.get(endIdx);

			let biggerY = beginY > endY ? beginY : endY;

			// Warning Icon 위치 설정 (Static Chart 일 경우와, RealTime Chart 일 경우 다름)
			let iconXPosition = isStaticChart ? (startTimestamp + endTimestamp) / 2 + 2 : endTimestamp;

			// 좌측 세로 라인
			addLineAnnotation({
				chartSurface: upperChartProperties.sciChartSurface,
				id: 'alarmAnnotation',
				x1: startTimestamp,
				x2: startTimestamp,
				y1: beginY,
				y2: biggerY + 10000,
				strokeColor: 'red'
			});

			// 우측 세로 라인
			addLineAnnotation({
				chartSurface: upperChartProperties.sciChartSurface,
				id: 'alarmAnnotation',
				x1: endTimestamp,
				x2: endTimestamp,
				y1: endY,
				y2: biggerY + 10000,
				strokeColor: 'red'
			});

			// 가로 라인
			addLineAnnotation({
				chartSurface: upperChartProperties.sciChartSurface,
				id: 'alarmAnnotation',
				x1: startTimestamp,
				x2: endTimestamp,
				y1: biggerY + 9000,
				y2: biggerY + 9000,
				strokeColor: 'red'
			});

			// Warning Icon 추가
			addWarningIconAnnotation({
				chartSurface: upperChartProperties.sciChartSurface,
				id: 'warningIconAnnotation',
				x1: iconXPosition,
				y1: biggerY + 10500
			});
		} catch (err) {
			console.error(err);
		}
	}
	//#endregion
</script>

<div class="h-full w-full">
	<!-- Upper Chart -->
	<div class="{legendPlacementDivId ? 'h-[70%]' : 'h-[85%]'} relative">
		<div id={chartNames[0]} class="m-auto h-full w-[98%]" />
	</div>

	<!-- Lower Chart -->
	<div class="relative h-[15%]">
		<div id={chartNames[1]} class="m-auto h-full w-[98%]" />
	</div>
</div>
