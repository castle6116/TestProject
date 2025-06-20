import {
	RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
	type SciChartSurface,
	type AxisBase2D,
} from "scichart";
import type { ChartLayoutState } from "scichart/Charting/LayoutManager/ChartLayoutState";

export class CustomRightAlignedOuterVerticallyStackedAxisLayoutStrategy extends RightAlignedOuterVerticallyStackedAxisLayoutStrategy {
	private defaultRightOuterAxisLayoutStrategy: RightAlignedOuterVerticallyStackedAxisLayoutStrategy;
	constructor() {
		super();

		this.defaultRightOuterAxisLayoutStrategy =
			new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();
	}

	override measureAxes(
		sciChartSurface: SciChartSurface,
		chartLayoutState: ChartLayoutState,
		axes: AxisBase2D[],
	) {
		const [firstAxis, ...stackedAxes] = axes;
		// measure stacked axes first
		super.measureAxes(sciChartSurface, chartLayoutState, stackedAxes);
		// then get the top offset for the normalAxis with stackedAxis.viewRect.bottom
		const stackedAxis = stackedAxes[0];
		this.defaultRightOuterAxisLayoutStrategy.measureAxes(sciChartSurface, chartLayoutState, [
			...stackedAxes,
			firstAxis,
		]);
	}

	override layoutAxes(
		left: number,
		top: number,
		right: number,
		bottom: number,
		axes: AxisBase2D[],
	) {
		const [firstAxis, ...stackedAxes] = axes;
		// layout stacked axes first
		super.layoutAxes(left, top, right, bottom, stackedAxes);
		// then get the top offset for the normalAxis with stackedAxis.viewRect.bottom
		const stackedAxis = stackedAxes[0];
		this.defaultRightOuterAxisLayoutStrategy.layoutAxes(
			left,
			stackedAxis.viewRect.top,
			right,
			bottom,
			[...stackedAxes, firstAxis], // normal axis
		);
	}
}
