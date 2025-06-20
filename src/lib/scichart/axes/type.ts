import type { Thickness } from "scichart";

export interface IChartXAxis {
	isAxisXVisible?: boolean;
	xLabelString?: string[];
	xAxisType?: "DateTime" | "Numeric";
	xRange?: number;
	xValues?: number[] | number[][];
	autoTicksX?: boolean;
	autoRangeX?: boolean;
	labelPrefix?: string;
	labelPostfix?: string;
	axisId?: string;
	gridLineColor?: { major: string; minor: string };
	fontSize?: number;
}
export interface IChartYAxis {
	isAxisYVisible?: boolean;
	setYVisibleRange?: boolean;
	autoTicksY?: boolean;
	autoRangeY?: boolean;
	yLabelPrecision?: number;
	yRangePadding?: { min: number; max: number };
	yGridLineColor?: { minor: string; major: string };
	yAxisTitle?: string;
	yFontSize?: number;
	yRange?: number[];
	yValues?: number[] | number[][];
	padding?: Thickness;
	majorDelta?: number;
	minorDelta?: number;
	isInnerAxis?: boolean;
	stackedAxisLength?: number | string;
	axisId?: string;
	axisAlignment?: "Left" | "Right";
	labelAlignment?: "Left" | "Right";
	axisBorder?: {
		borderLeft?: number;
		borderRight?: number;
		borderTop?: number;
		borderBottom?: number;
	};
}
