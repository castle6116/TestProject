import {
	SciChartSurface,
	BaseRenderableSeries,
	ELegendOrientation,
	LegendModifier,
	ZoomPanModifier,
	EXyDirection,
	EExecuteOn,
	ZoomExtentsModifier,
	MouseWheelZoomModifier,
	RubberBandXyZoomModifier,
	CursorModifier,
	SeriesInfo,
	XySeriesInfo,
	RolloverModifier,
	XyDataSeries,
	RolloverTooltipSvgAnnotation,
	type IRenderableSeries,
	type ICursorModifierOptions,
	type IRolloverModifierOptions,
	type TCursorTooltipDataTemplate,
	type TRolloverTooltipSvgTemplate,
	type TRolloverTooltipDataTemplate,
} from "scichart";
import { cursorModifierOpts } from "../visuals/theme/theme";
import { makeDateString, makeTimeString } from "$lib/common/date";

export function addLegendModifier({
	chartSurface,
	placementDivId,
	excludeRenderableSeries,
	orientation,
	isCheckedChagedCallback,
}: {
	chartSurface: SciChartSurface;
	placementDivId?: string;
	excludeRenderableSeries?: BaseRenderableSeries[];
	orientation?: ELegendOrientation;
	isCheckedChagedCallback?: (series: IRenderableSeries, isChecked: boolean) => void;
}) {
	orientation = orientation ?? ELegendOrientation.Horizontal;
	const legendModifier = new LegendModifier({
		id: `${chartSurface.id}-${placementDivId}`,
		placementDivId: placementDivId,
		orientation: orientation,
		margin: -2,
		showCheckboxes: true,
		isCheckedChangedCallback: isCheckedChagedCallback,
	});
	chartSurface.chartModifiers.add(legendModifier);

	// Exclude Renderable Series
	if (excludeRenderableSeries) {
		excludeRenderableSeries.forEach((series) => {
			legendModifier.includeSeries(series, false);
		});
	}
	return legendModifier;
}

export function addZoomAndDragModifier(
	chartSurface: SciChartSurface,
	options?: {
		modifierGroup?: string;
	},
) {
	chartSurface.chartModifiers.add(
		new ZoomPanModifier({
			xyDirection: EXyDirection.XDirection,
			executeOn: EExecuteOn.MouseRightButton,
			enableZoom: false,
			modifierGroup: options?.modifierGroup,
		}),
		new ZoomExtentsModifier({
			isAnimated: true,
			modifierGroup: options?.modifierGroup,
		}),
		new MouseWheelZoomModifier({
			xyDirection: EXyDirection.XDirection,
			modifierGroup: options?.modifierGroup,
		}),
		new RubberBandXyZoomModifier({
			isAnimated: true,
			xyDirection: EXyDirection.XDirection,
			modifierGroup: options?.modifierGroup,
		}),
	);
}

// Add Custom Mouse Cursor
export function showTooltipOnGraph({
	surface,
	replaceHoverData,
	options,
	cursorModifierOptions,
}: {
	surface: SciChartSurface;
	replaceHoverData?: {
		xLabel?: "Date" | "Default" | string;
		xLabelSuffix?: string;
		yLabel?: string[];
		yLabelSuffix?: string;
		yLabelSuffixAfterSort?: "even" | "odd";
		yValueSuffix?: string;
		yValuePrecision?: number;
	};
	options?: {
		isSort?: boolean;
		flattenCount?: number;
	};
	cursorModifierOptions?: ICursorModifierOptions;
}) {
	const cursorTemplate = makeCustomMouseCursorTemplate(replaceHoverData, options);
	cursorModifierOptions = { ...cursorModifierOpts, ...cursorModifierOptions };
	const cursorModifier = makeCursorModifier(cursorModifierOptions, cursorTemplate);
	surface.chartModifiers.add(cursorModifier);
}
export const makeCursorModifier = (
	cursorModifierOpts: ICursorModifierOptions,
	customMouseCursorTemplate: TCursorTooltipDataTemplate,
) => {
	return new CursorModifier({
		...cursorModifierOpts,
		tooltipDataTemplate: customMouseCursorTemplate,
	});
};

export const makeCustomMouseCursorTemplate: (
	replaceHoverData?: {
		xLabel?: "Date" | "Default" | string;
		yLabel?: string[];
		yLabelSuffix?: string;
		yLabelSuffixAfterSort?: "even" | "odd";
		yValueSuffix?: string;
		yValuePrecision?: number;
	},
	options?: {
		isSort?: boolean;
		flattenCount?: number;
	},
) => TCursorTooltipDataTemplate = (
	replaceHoverData: {
		xLabel?: "Date" | "Default" | string;
		yLabel?: string[];
		xLabelSuffix?: string;
		yValueSuffix?: string;
		yLabelSuffixAfterSort?: "even" | "odd";
		yLabelSuffix?: string;
		yValuePrecision?: number;
	},
	options: {
		isSort?: boolean;
		flattenCount?: number;
	},
) => {
	let xLabelSuffix = replaceHoverData?.xLabelSuffix ?? "";
	let yValuePrecision = replaceHoverData?.yValuePrecision ?? 0;
	let yValueSuffix = replaceHoverData?.yValueSuffix ?? "";
	let yLabelSuffix = replaceHoverData?.yLabelSuffix ?? "";
	let yValueSuffixAfterSort = replaceHoverData?.yLabelSuffixAfterSort ?? undefined;

	return (seriesInfos: SeriesInfo[]) => {
		let valuesWithLabels: string[] = [];
		let paddingForTooltip = "  ";

		seriesInfos.forEach((si: XySeriesInfo, idx: number) => {
			// 1. "Highlight" 시리즈는 툴팁에 표시하지 않음
			if (si.seriesName === "Highlight") return;

			// 2. Y 값 처리
			// seriesInfo의 yValue를 기본 소수점 자리수에 맞게 표시
			let yValue = si.yValue;
			let displayYValue = yValue?.toFixed(yValuePrecision);

			// "Loss" 시리즈일 경우, 소수점 4자리로 표시
			if (si.seriesName.includes("Loss")) {
				displayYValue = yValue?.toFixed(4);
			}

			// 3. Y 축 레이블 설정
			// yLabel이 주어졌다면 yLabel을, 그렇지 않다면 seriesName을 레이블로 사용
			let yLabel = replaceHoverData?.yLabel ? replaceHoverData.yLabel[idx] : si.seriesName;

			// Y Label이 '주차', '시간', '일', '월' 중 하나인 경우, 인덱스와 함께 표시
			if (["주차", "시간", "일", "월"].includes(yLabel)) {
				const index = si.dataSeriesIndex + 1; // 주차, 시간 등으로 표시할 때 인덱스 추가
				valuesWithLabels.push(
					`${index} ${si.seriesName}: ${displayYValue}${yValueSuffix}${paddingForTooltip}`,
				);
			} else {
				// 일반 레이블 처리
				valuesWithLabels.push(`${yLabel}: ${displayYValue}${yValueSuffix}${paddingForTooltip}`);
			}

			// 4. X 축 값 처리 및 레이블 설정
			// hover 시 x값에 대한 정보 입력
			// highlight 를 제외한 마지막 series 일 경우, x값에 대한 정보 입력 (X 축은 공통으로 사용하기 때문에 마지막 series 에서만 입력)
			// xLabel 값이 없을 경우, x Hover 에 대해서 표시하지 않음.
			if (idx === seriesInfos.length - 1 && replaceHoverData?.xLabel) {
				// xLabel이 Date일 경우, 발생 일자와 시간을 표시
				if (replaceHoverData?.xLabel == "Date") {
					let dateLabel: string = "발생 일자";
					let dateString: string = makeDateString(
						new Date((si.xValue - 9 * 3600) * 1000)?.toISOString(),
						true,
						true,
					);
					let timeLabel: string = "발생 시간";
					let timeString: string = makeTimeString(
						new Date((si.xValue - 9 * 3600) * 1000)?.toISOString(),
						true,
						true,
					);

					valuesWithLabels.push(`${dateLabel}: ${dateString} ${paddingForTooltip}`);
					valuesWithLabels.push(`${timeLabel}: ${timeString} ${paddingForTooltip}`);
				}
				// xLabel이 Default일 경우, 포맷된 X 값만 표시
				else if (replaceHoverData?.xLabel == "Default") {
					valuesWithLabels.push(`${Math.round(si.xValue) + 1}월 ${xLabelSuffix}`);
				}
				// 사용자 정의 X Label의 경우 지정된 이름으로 표시
				else {
					let xLabel: string = replaceHoverData.xLabel;
					valuesWithLabels.push(`${xLabel}: ${si.formattedXValue} ${paddingForTooltip}`);
				}
			}
		});

		if (options?.isSort)
			valuesWithLabels.sort((a, b) => {
				let firstLabel = a.split(":")[0];
				let secondLabel = b.split(":")[0];
				return firstLabel.localeCompare(secondLabel);
			});

		if (yValueSuffixAfterSort == "even") {
			valuesWithLabels.forEach((value, index) => {
				if (index % 2 == 0) {
					let [yLabel, content] = value.split(":");
					valuesWithLabels[index] = `${yLabel}${yLabelSuffix}: ${content}`;
				}
			});
		}

		if (yValueSuffixAfterSort == "odd") {
			valuesWithLabels.forEach((value, index) => {
				if (index % 2 == 1) {
					let [yLabel, content] = value.split(":");
					valuesWithLabels[index] = `${yLabel}${yLabelSuffix}: ${content}`;
				}
			});
		}

		if (options?.flattenCount)
			valuesWithLabels = valuesWithLabels.reduce((pre, cur, idx) => {
				if (idx % options.flattenCount! == 0) {
					pre.push(cur);
				} else {
					let [_label, keyword, value] = cur.split(" ");
					pre[pre.length - 1] += `/ ${keyword} ${value} ${paddingForTooltip}`;
				}
				return pre;
			}, [] as string[]);

		return valuesWithLabels;
	};
};

export function addRolloverModifier({
	surface,
	rolloverModifierOptions,
}: {
	surface: SciChartSurface;
	rolloverModifierOptions?: IRolloverModifierOptions;
}) {
	const tooltipDataTemplate = makeRolloverTooltipDataTemplate(surface);
	const rolloverModifier = new RolloverModifier({
		...rolloverModifierOptions,
		tooltipDataTemplate: tooltipDataTemplate,
	});
	surface.chartModifiers.add(rolloverModifier);
}

export function makeRolloverTooltipDataTemplate(
	surface: SciChartSurface,
): TRolloverTooltipDataTemplate {
	return (seriesInfo: XySeriesInfo) => {
		// AI Series 인 경우, 표시하지 않음
		if (seriesInfo.seriesName.includes("ai")) return [];

		// 일반 DataSeries 인 경우, 아래와 같이 표시
		const valuesWithLabels: string[] = [];
		const index = seriesInfo.dataSeriesIndex;
		const loadSeriesId = seriesInfo.seriesName;
		const aiSeriesId = seriesInfo.seriesName + "ai";
		const aiSeries = surface.renderableSeries.getById(aiSeriesId).dataSeries as XyDataSeries;
		const aiValue = aiSeries.getNativeYValues().get(index);
		valuesWithLabels.push(
			`${loadSeriesId} 실제 ${seriesInfo.yValue?.toFixed(2)} (AI ${aiValue.toFixed(2)})`,
		);

		return valuesWithLabels;
	};
}

export function rolloverTooltipDataTemplate(seriesInfo: XySeriesInfo): string[] {
	const valuesWithLabels: string[] = [];
	let yValue = seriesInfo.yValue;

	let displayYValue = yValue.toFixed(2);

	if (seriesInfo.seriesName.includes("Loss")) {
		displayYValue = yValue.toFixed(4);
	}

	valuesWithLabels.push(`${seriesInfo.seriesName} ${displayYValue}`);
	return valuesWithLabels;
}

export function makeRolloverSvgTemplate(
	id: string,
	seriesInfo: SeriesInfo,
	rolloverTooltip: RolloverTooltipSvgAnnotation,
): TRolloverTooltipSvgTemplate {
	const { tooltipTitle, tooltipColor, tooltipTextColor } = rolloverTooltip.tooltipProps;
	return () => `
    <svg width=200 height=20>
      <rect width="100%" height="100%" fill="white" />
      <svg width="100%">
          <text y="0" font-size="13" font-family="Verdana" dy="0" fill="${tooltipColor}">
              <tspan x="15" dy="1.2em">${tooltipTitle}:  ${seriesInfo.formattedYValue}</tspan>
              <tspan x="15" dy="1.2em"></tspan>
          </text>
      </svg>
  </svg>`;
}
