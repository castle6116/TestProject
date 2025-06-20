import {
	Point,
	EPieType,
	Thickness,
	PieSegment,
	ENumericFormat,
	GradientParams,
	PieLabelProvider,
	ELegendPlacement,
	ELegendOrientation,
	SciChartPieSurface,
} from "scichart";
import { scichart2022Theme, CHART_BACKGROUND_COLOR } from "../../visuals/theme/theme";
import type { IPieChartData } from "./type";

export async function createPieChartSurface({
	type = "Pie",
	chartName,
	showLegend = true,
	backgroundColor,
}: {
	chartName: string;
	type?: "Pie" | "Donut";
	showLegend?: boolean;
	backgroundColor?: string;
}) {
	const pieChartSurface = await SciChartPieSurface.create(chartName, {
		theme: {
			...scichart2022Theme.SciChartJsTheme,
			sciChartBackground: backgroundColor,
			loadingAnimationBackground: backgroundColor ? backgroundColor : CHART_BACKGROUND_COLOR,
			loadingAnimationForeground: "green",
			legendBackgroundBrush: "null",
		},
		pieType: EPieType[type],
		animate: true,
		showLegend,
		showLegendCheckBoxes: true,
		animateLegend: true,
		labelRadiusAdjustment: 1.55,
		padding: new Thickness(0, 100, 0, 0),
	});
	pieChartSurface.legend.placement = ELegendPlacement.TopRight;
	pieChartSurface.legend.orientation = ELegendOrientation.Vertical;
	return pieChartSurface;
}

export function initPieChartSeries({
	pieChartSurface,
	chartData,
	labelPostfix = "회",
}: {
	pieChartSurface: SciChartPieSurface;
	chartData: IPieChartData[];
	labelPostfix?: string;
}) {
	let segmentArray: PieSegment[] = [];

	/**
	 * PieChart Legend 설정할 때, Legend clear 후 자동으로 적용이 안되어서 수동으로 초기화 후 재할당 작업
	 */
	pieChartSurface.legend.setPieSegmentArray(segmentArray);
	pieChartSurface.pieSegments.clear();

	chartData.forEach((item) => {
		let segment: PieSegment;
		segment = createPieSegment(item, labelPostfix);
		segmentArray.push(segment);
		pieChartSurface.pieSegments.add(segment);
	});
	pieChartSurface.legend.setPieSegmentArray(segmentArray);
}

function createPieSegment(
	{ color, value, text, colorLinearGradient }: IPieChartData,
	labelPostfix: string,
	labelOffset?: Point,
) {
	const pieSegment = new PieSegment({
		color,
		value,
		text,
		labelOffset: labelOffset,
		labelStyle: {
			fontSize: 12,
			fontWeight: "light",
			color: "#505053",
		},
		labelProvider: new PieLabelProvider({
			labelFormat: ENumericFormat.NoFormat,
			labelPostfix,
		}),
		colorLinearGradient:
			colorLinearGradient &&
			new GradientParams(new Point(0, 0), new Point(0, 1), [
				{ color: colorLinearGradient.from, offset: 0 },
				{ color: colorLinearGradient.to, offset: 1 },
			]),
	});
	return pieSegment;
}
