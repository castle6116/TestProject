export interface IColumnChartStyle {
	strokeColor: string;
	pointWidth?: number;
	strokeLightColor?: string;
	strokeDashArray?: number[];
	thickness?: number;
	backgroundColor?: string;
	fontSize?: number;
	barWidth?: number;
}

export interface IStackedColumnChartStyle {
	strokeColor: string[];
	thickness?: number;
	barWidth?: number;
	fontSize?: number;
	spacing?: number;
}

export interface IStackedColumnChartData {
	xValues: number[][];
	yValues: number[][];
}
