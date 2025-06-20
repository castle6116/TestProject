import {
	XyDataSeries,
	EResamplingMode,
	EllipsePointMarker,
	FastLineRenderableSeries,
	type TSciChart,
} from "scichart";
import type { ILineChartStyle } from "./type";

//#region Line Chart
/**
 * Line Chart Renderable Series 생성
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

export function createLineRenderableSeries(
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
): FastLineRenderableSeries {
	let renderableSeries: FastLineRenderableSeries = new FastLineRenderableSeries(wasmContext, {
		resamplingMode: EResamplingMode.Auto,
		stroke: style.strokeColor,
		strokeThickness: style.thickness || 0.8,
		strokeDashArray: style.strokeDashArray,
		pointMarker: new EllipsePointMarker(wasmContext, {
			width: style.pointWidth || 0,
			height: style.pointWidth || 0,
			stroke: style.strokeColor,
			strokeThickness: style.thickness || 0.8,
			fill: style.strokeColor,
		}),
		dataSeries: dataSeries,
		id,
		yAxisId,
	});

	return renderableSeries;
}

//#endregion
