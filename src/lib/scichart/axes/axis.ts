import {
	Thickness,
	EAutoRange,
	NumberRange,
	NumericAxis,
	EAxisAlignment,
	ENumericFormat,
	ELabelAlignment,
	TextLabelProvider,
	NumericLabelProvider,
	type TSciChart,
} from "scichart";
import { AXIS_MAJOR_LINE_COLOR, AXIS_MINOR_LINE_COLOR } from "../visuals/theme/theme";
import type { IChartCommonParams } from "../core/type";
import type { IChartXAxis, IChartYAxis } from "./type";

export function initChartAxis({
	sciChart,
	xAxisParams,
	yAxisParams,
}: {
	sciChart: IChartCommonParams;
	xAxisParams: IChartXAxis;
	yAxisParams: IChartYAxis;
}) {
	// Axis 생성
	const xAxis: NumericAxis = createNumericXAxis(sciChart.wasmContext, xAxisParams);

	const yAxis: NumericAxis = createNumericYAxis(sciChart.wasmContext, yAxisParams);

	// SciChart에 Axis 추가
	sciChart.sciChartSurface.xAxes.add(xAxis);
	sciChart.sciChartSurface.yAxes.add(yAxis);

	return [xAxis, yAxis];
}

//#region Function (Creator)
export function createNumericXAxis(
	wasmContext: TSciChart,
	{
		isAxisXVisible: isVisible,
		autoTicksX,
		xAxisType,
		xLabelString,
		fontSize,
		autoRangeX: isAutoRange,
		xValues,
		xRange,
		gridLineColor,
		labelPrefix,
		labelPostfix,
		axisId,
	}: IChartXAxis,
): NumericAxis {
	let labelProvider;
	let xRangeMaxValue;
	let xRangeMinValue;

	if (xAxisType == undefined) xAxisType = "DateTime";
	if (xLabelString == undefined) {
		if (xAxisType == "DateTime") {
			labelProvider = new NumericLabelProvider({
				labelFormat: ENumericFormat.Date_HHMMSS,
				cursorLabelFormat: ENumericFormat.Date_HHMMSS,
				labelPrefix: labelPrefix,
				labelPostfix: labelPostfix,
			});

			xRangeMaxValue = Date.now() / 1_000 + 9 * 60 * 60;
			xRangeMinValue = xRangeMaxValue - (xRange || 180);
		}
		if (xAxisType == "Numeric") {
			labelProvider = new NumericLabelProvider({
				labelFormat: ENumericFormat.NoFormat,
				cursorLabelFormat: ENumericFormat.Decimal,
				labelPrecision: 0,
				labelPrefix: labelPrefix,
				labelPostfix: labelPostfix,
			});

			xRangeMaxValue = 31;
			xRangeMinValue = 1;
		}
	} else {
		labelProvider = new TextLabelProvider({
			labels: xLabelString,
		});
	}

	const axis: NumericAxis = new NumericAxis(wasmContext, {
		isVisible,
		id: axisId,
		labelStyle: {
			fontSize: fontSize || 10,
			color: "#637381",
		},
		minorGridLineStyle: {
			color: gridLineColor ? gridLineColor.major : AXIS_MINOR_LINE_COLOR,
		},
		majorGridLineStyle: {
			color: gridLineColor ? gridLineColor.major : AXIS_MAJOR_LINE_COLOR,
		},
		drawMinorGridLines: false,
		drawMajorGridLines: false,
		labelProvider: labelProvider,
		autoTicks: !autoTicksX || xLabelString ? false : true,
		majorDelta: !autoTicksX || xLabelString ? 1 : undefined,
		minorDelta: !autoTicksX || xLabelString ? 1 : undefined,
		autoRange: isAutoRange ? EAutoRange.Once : undefined,
	});

	if (xValues && !Array.isArray(xValues[0])) {
		axis.visibleRange = new NumberRange(xValues[0], xValues[xValues.length - 1] as number);
	} else {
		axis.visibleRange = new NumberRange(xRangeMinValue, xRangeMaxValue);
	}

	return axis;
}

export function createNumericYAxis(
	wasmContext: TSciChart,
	{
		isAxisYVisible: isVisible,
		autoRangeY: autoRange,
		yGridLineColor,
		yRange,
		setYVisibleRange: setVisibleRange,
		yRangePadding,
		yAxisTitle: axisTitle,
		yFontSize: fontSize,
		autoTicksY: autoTicks,
		yLabelPrecision,
		padding,
		majorDelta,
		minorDelta,
		isInnerAxis,
		axisAlignment,
		axisId,
		labelAlignment,
		axisBorder,
		stackedAxisLength,
	}: Omit<IChartYAxis, "yValues">,
): NumericAxis {
	let minY: number = 0;
	let maxY: number = 500;

	// yRange 값이 있을 경우, y축 visibleRange 설정
	if (yRange !== undefined && yRange[0] !== yRange[1]) {
		minY = yRange[0];
		maxY = yRange[1];
	}

	const axis: NumericAxis = new NumericAxis(wasmContext, {
		stackedAxisLength: stackedAxisLength,
		isVisible: isVisible,
		id: axisId,
		isInnerAxis: isInnerAxis,
		minorGridLineStyle: {
			color: yGridLineColor ? yGridLineColor.minor : AXIS_MINOR_LINE_COLOR,
			// strokeDashArray: [10, 15],
		},
		majorGridLineStyle: {
			color: yGridLineColor ? yGridLineColor.major : AXIS_MAJOR_LINE_COLOR,
			strokeDashArray: [1, 3],
			strokeThickness: 0.5,
		},
		drawMinorGridLines: yGridLineColor ? true : false,
		drawMajorGridLines: yGridLineColor ? true : false,
		visibleRange:
			setVisibleRange == undefined || setVisibleRange !== false
				? // undefined 이거나 true 일 경우
					new NumberRange(minY, maxY)
				: new NumberRange(minY, maxY),
		autoRange: autoRange ? EAutoRange.Always : undefined,
		growBy: yRangePadding && new NumberRange(yRangePadding.min, yRangePadding.max),
		// y축 value position
		labelStyle: {
			alignment: labelAlignment == "Left" ? ELabelAlignment.Left : ELabelAlignment.Right,
			fontSize: fontSize || 12,
			padding: padding || new Thickness(0, 0, 0, 0),
		},
		// y축 title
		axisTitle: axisTitle,
		// y축 title style
		axisTitleStyle: {
			fontSize: fontSize || 12,
			rotation: 1,
			alignment: ELabelAlignment.Left,
		},

		// y축 value 라인 위치
		axisAlignment: axisAlignment == "Right" ? EAxisAlignment.Right : EAxisAlignment.Left,
		// 소숫점 표시
		labelPrecision: yLabelPrecision,

		// y축 값 표시 개수
		autoTicks: autoTicks,
		majorDelta: majorDelta || maxY / 2,
		minorDelta: minorDelta ?? undefined,
		zoomExtentsToInitialRange: true,
		axisBorder: {
			borderLeft: axisBorder?.borderLeft || 0,
			borderRight: axisBorder?.borderRight || 0,
			borderTop: axisBorder?.borderTop || 0,
			borderBottom: axisBorder?.borderBottom || 0,
		},
	});
	return axis;
}
