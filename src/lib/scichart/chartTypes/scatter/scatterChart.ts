import {
	XyDataSeries,
	EllipsePointMarker,
	XyScatterRenderableSeries,
	type TSciChart,
} from "scichart";
import type { IScatterChartStyle } from "./type";

/**
 * Scatter Chart Renderable Series 생성
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

export function createScatterRenderableSeries(
	wasmContext: TSciChart,
	dataSeries: XyDataSeries,
	{
		style,
		id,
		yAxisId,
	}: {
		style: IScatterChartStyle;
		id?: string;
		yAxisId?: string;
	},
): XyScatterRenderableSeries {
	let renderableSeries: XyScatterRenderableSeries = new XyScatterRenderableSeries(wasmContext, {
		dataSeries,
		pointMarker: new EllipsePointMarker(wasmContext, {
			width: 1.5,
			height: 1.5,
			stroke: style.strokeColor,
			strokeThickness: style.thickness || 0.8,
			fill: style.strokeColor,
		}),
		id,
		yAxisId,
	});

	return renderableSeries;
}
