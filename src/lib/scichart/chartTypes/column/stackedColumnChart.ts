import {
	Thickness,
	XyDataSeries,
	StackedColumnCollection,
	EColumnDataLabelPosition,
	StackedColumnRenderableSeries,
	type TSciChart,
} from "scichart";
import type { IChartCommonParams } from "$lib/scichart/core/type";
import type { IStackedColumnChartStyle, IStackedColumnChartData, IColumnChartStyle } from "./type";
import { initDataSeries } from "$lib/scichart/core/series";

/**
 * Stacked Column Chart Renderable Series 생성 및 Surface 에 추가
 * @param sciChartParams SciChart Params
 * @param style Stacked Column Chart Style {
 * 					strokeColor: string[],
 * 					thickness?: number,
 * 					fontSize?: number,
 * 					barWidth?: number
 * 				}
 * @param dataSeriesName Data Series Name {string[]}
 * @param chartData Stacked Column Chart Data: dataSeriesName 개수 만큼 배열로 전달 {
 * 					xValues: number[][],
 * 					yValues: number[][]
 * 				}
 * @param yAxisId Mapping 할 Y축 ID
 */
export function drawStackedColumnSeries({
	sciChartParams,
	style,
	dataSeriesName,
	chartData,
	yAxisId,
	id,
}: {
	sciChartParams: IChartCommonParams;
	style: IStackedColumnChartStyle;
	dataSeriesName: string[];
	chartData: IStackedColumnChartData;
	yAxisId?: string;
	id?: string;
}) {
	if (Array.isArray(dataSeriesName)) {
		// dataSeriesName 이 여러개일 경우, 하나의 surface 에 추가
		// Stacked Column Collection 생성
		const stackedCollection: StackedColumnCollection = new StackedColumnCollection(
			sciChartParams.wasmContext,
			{
				dataPointWidth: style?.barWidth ?? 0.8,
				spacing: style?.spacing ?? 0,
				yAxisId: yAxisId,
			},
		);

		// dataSeriesName 개수 만큼 반복
		dataSeriesName.forEach((name, i) => {
			const dataSeries = initDataSeries(sciChartParams.wasmContext, {
				dataSeriesName: name,
				xValues: chartData.xValues[i] as number[],
				yValues: chartData.yValues[i] as number[],
			});
			const columnSeries = createStackedColumnRenderableSeries(
				sciChartParams.wasmContext,
				dataSeries,
				{
					strokeColor: style.strokeColor[i] as string,
					thickness: style.thickness,
					fontSize: style.fontSize,
				},
				`${id}_${name}`,
			);
			// columnSeries 를 Stacked Collection 에 추가
			stackedCollection.add(columnSeries as StackedColumnRenderableSeries);

			// 데이터 추가 후, 마지막 Series 일 경우, Stacked Collection 을 Surface 에 추가
			if (i === dataSeriesName.length - 1) {
				sciChartParams.sciChartSurface.renderableSeries.add(stackedCollection);
			}
		});
	}
}

function createStackedColumnRenderableSeries(
	wasmContext: TSciChart,
	dataSeries: XyDataSeries,
	style: IColumnChartStyle,
	id?: string,
): StackedColumnRenderableSeries {
	let renderableSeries: StackedColumnRenderableSeries = new StackedColumnRenderableSeries(
		wasmContext,
		{
			id,
			dataSeries: dataSeries,
			fill: style.strokeColor,
			stroke: style.strokeColor,
			strokeThickness: style.thickness || 0.8,
			opacity: 1,
			stackedGroupId: `Group${dataSeries.dataSeriesName}`,
			dataLabels: {
				positionMode: EColumnDataLabelPosition.Outside,
				color: "black",
				style: {
					fontSize: style.fontSize ?? 12,
					fontFamily: "Arial",
					padding: new Thickness(0, 0, 2, 0),
				},
				precision: 0,
			},
		},
	);
	return renderableSeries;
}
