import {
	XyDataSeries,
	EResamplingMode,
	SplineLineRenderableSeries,
	type TSciChart,
} from "scichart";
import type { ILineChartStyle } from "./type";

/**
 * Spline Chart Renderable Series 생성
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
 */
export function createSplineLineRenderableSeries(
	wasmContext: TSciChart,
	dataSeries: XyDataSeries,
	{
		style,
		id,
		yAxisId,
	}: {
		style: ILineChartStyle;
		id?: string;
		yAxisId?: string;
	},
): SplineLineRenderableSeries {
	let renderableSeries: SplineLineRenderableSeries = new SplineLineRenderableSeries(wasmContext, {
		resamplingMode: EResamplingMode.Auto,
		stroke: style.strokeColor,
		strokeThickness: style.thickness || 0.8,
		dataSeries: dataSeries,
		id,
		yAxisId,
		// Change Line Color When Over High Level
		// paletteProvider: strokePaletteProvider,
	});

	return renderableSeries;
}
