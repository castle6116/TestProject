import {
	Point,
	AUTO_COLOR,
	XyDataSeries,
	GradientParams,
	EResamplingMode,
	FastMountainRenderableSeries,
	type TSciChart,
} from "scichart";
import type { ILineChartStyle } from "./type";

/**
 * Mountain Chart Renderable Series 생성
 * @param wasmContext Scichart 의 wasmContext
 * @param dataSeries	생성한 DataSeries
 * @param style	Line Chart Style: {
 * 					strokeColor: string,
 * 					thickness?: number,
 * 					pointWidth?: number,
 * 					strokeDashArray?: number[]
 * 				}
 * @param id Renderable Series ID
 * @param yAxisId Mapping 할 Y축 ID
 * @param isStepLine Step Line 여부 (계단 형태)
 */
export function createMountainRenderableSeries(
	wasmContext: TSciChart,
	dataSeries: XyDataSeries,
	{
		style,
		id,
		yAxisId,
		isStepLine = false,
	}: {
		style: ILineChartStyle;
		id?: string;
		yAxisId?: string;
		isStepLine?: boolean;
	},
): FastMountainRenderableSeries {
	let renderableSeries: FastMountainRenderableSeries = new FastMountainRenderableSeries(
		wasmContext,
		{
			resamplingMode: EResamplingMode.Auto,
			stroke: style.strokeColor,
			strokeThickness: style.thickness || 0.8,
			dataSeries: dataSeries,
			// Change Line Color When Over High Level
			// paletteProvider: strokePaletteProvider,
			isDigitalLine: isStepLine,
			fill: AUTO_COLOR,
			id,
			yAxisId,
			fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
				{ color: hexToRGB("#36F0A5", 1), offset: 0 },
				{ color: hexToRGB("#36F0A5", 0.2), offset: 1 },
			]),
		},
	);

	return renderableSeries;
}

//#region Private Function
function hexToRGB(hex: string, alpha?: number): string {
	let r = parseInt(hex.slice(1, 3), 16),
		g = parseInt(hex.slice(3, 5), 16),
		b = parseInt(hex.slice(5, 7), 16);

	if (alpha) {
		return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
	} else {
		return "rgb(" + r + ", " + g + ", " + b + ")";
	}
}
