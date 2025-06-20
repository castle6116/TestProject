import {
	type TSciChart,
	type SciChartSurface,
	type BaseRenderableSeries,
	XyDataSeries,
} from "scichart";

export function initDataSeries(
	wasmContext: TSciChart,
	{
		dataSeriesName,
		fifoCapacity,
		xValues,
		yValues,
	}: {
		dataSeriesName: string;
		fifoCapacity?: number;
		xValues?: number[];
		yValues?: number[];
	},
): XyDataSeries {
	const dataSeries: XyDataSeries = new XyDataSeries(wasmContext, {
		dataSeriesName: dataSeriesName,
		containsNaN: false,
		isSorted: true,
		dataIsSortedInX: true,
		dataEvenlySpacedInX: true,
		fifoCapacity,
		xValues,
		yValues,
		id: dataSeriesName,
	});
	return dataSeries;
}

export function addChartRenderableSeries(
	scichartSurface: SciChartSurface,
	renderableSeries: BaseRenderableSeries,
) {
	scichartSurface.renderableSeries.add(renderableSeries);
}
