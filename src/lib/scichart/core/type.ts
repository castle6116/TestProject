import type { Thickness, SciChartSurface, TSciChart } from "scichart";
import type { IChartXAxis, IChartYAxis } from "../axes/type";

//#region Interface
export interface IInitChartParams {
	chartSurfaceParam: IChartSurface;
	xAxisParam: IChartXAxis;
	yAxisParam: IChartYAxis;
}

export interface IChartSurface {
	chartName: string;
	isDrawBehind?: boolean;
	padding?: Thickness;
	background?: string;
	isDarkMode?: boolean;
}
export interface IChartCommonParams {
	sciChartSurface: SciChartSurface;
	wasmContext: TSciChart;
}
