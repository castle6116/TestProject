import {
	Thickness,
	XyDataSeries,
	EResamplingMode,
	EColumnDataLabelPosition,
	FastColumnRenderableSeries,
	type TSciChart,
} from "scichart";
import type { IColumnChartStyle } from "./type";

/**
 * Column Chart Renderable Series 생성
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
 * @param precision 소숫점 표시 (자릿수)
 */
export function createColumnRenderableSeries(
	wasmContext: TSciChart,
	dataSeries: XyDataSeries,
	{
		style,
		id,
		yAxisId,
		precision,
	}: {
		style: IColumnChartStyle;
		id?: string;
		yAxisId?: string;
		precision?: number;
	},
): FastColumnRenderableSeries {
	let renderableSeries: FastColumnRenderableSeries = new FastColumnRenderableSeries(wasmContext, {
		// When solid fill required, use fill
		fill: style.strokeColor,
		stroke: style.strokeColor,
		strokeThickness: style.thickness || 0.8,
		dataPointWidth: style.barWidth || 0.4,
		cornerRadius: 0,
		dataSeries: dataSeries,
		resamplingMode: EResamplingMode.Auto,
		id,
		yAxisId,
		dataLabels: {
			positionMode: EColumnDataLabelPosition.Outside,
			precision: precision ?? 0,
			color: "#EEE",
			style: {
				fontFamily: "Arial",
				fontSize: 10,
				padding: new Thickness(0, 0, 5, 0),
			},
		},
	});

	return renderableSeries;
}
