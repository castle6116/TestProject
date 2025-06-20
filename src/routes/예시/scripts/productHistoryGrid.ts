import { setColumnDefinition } from "$lib/components/grid/grid";
import type { CellComponent } from "tabulator-tables";
import {
	addChartRenderableSeries,
	addLegendModifier,
	createLineRenderableSeries,
	initDataSeries,
	type IChartCommonParams,
	type ILineChartStyle,
} from "$lib/scichart/api";
import { NumberRange, type LegendModifier, type XyDataSeries } from "scichart";
import type { IFilterRawArgs, IGqlRawsData, TRawsResponse } from "$lib/api/graphql/raw/schema";
import { PUBLIC_X_Z_SCALING_FACTOR } from "$env/static/public";

export const resultFormatter = function (data: CellComponent) {
	if (data.getValue() == "Y") {
		// 정상
		return `<div class="px-1.5 border border-[#4F6E3B] test-sm bg-[#DAFBF2] rounded-sm text-[#236D34] dark:bg-[#22373B] dark:text-[#77D2CD] dark:border-[#396A6C]">정상</div>`;
	} else if (data.getValue() === "N") {
		// 이상
		return `<div class="px-1.5 border  test-sm rounded-sm text-[#6D2C25]  bg-[#FDE0E0] border-[#8D4368] dark:text-[#FF74B0]  dark:bg-[#492228] dark:border-[#683950]">이상</div>`;
	} else if (data.getValue() == "W") {
		return `<div class="px-1.5 border  test-sm rounded-sm text-[#704F2A]  bg-[#F7EBD5] border-[#C07509] dark:text-[#FFA50E]  dark:bg-[#351F00] dark:border-[#B46C06]">경고</div>`;
	}
	return "";
};
export const ctFormatter = function (data: CellComponent) {
	if (data.getData().ctResult == "Y") {
		// 정상
		return (data.getValue() / 10 ** 9).toFixed(2);
	} else if (data.getData().ctResult === "N") {
		// 이상
		return `<div class="px-1.5 border  test-sm rounded-sm text-[#6D2C25]  bg-[#FDE0E0] border-[#8D4368] dark:text-[#FF74B0]  dark:bg-[#492228] dark:border-[#683950]">${(data.getValue() / 10 ** 9).toFixed(2)}</div>`;
	}
	return "";
};
export const loadSumFormatter = function (data: CellComponent) {
	if (data.getData().loadSumResult == "Y") {
		// 정상
		return data.getValue().toFixed(0);
	} else if (data.getData().loadSumResult === "N") {
		// 이상
		return `<div class="px-1.5 border  test-sm rounded-sm text-[#6D2C25]  bg-[#FDE0E0] border-[#8D4368] dark:text-[#FF74B0]  dark:bg-[#492228] dark:border-[#683950]">${data.getValue().toFixed(0)}</div>`;
	}
	return "ERR";
};
export const aiFormatter = function (data: CellComponent) {
	if (data.getData().aiResult == "Y") {
		// 정상
		return data.getValue();
	} else if (data.getData().aiResult === "N") {
		// 이상
		return `<div class="px-1.5 border  test-sm rounded-sm text-[#6D2C25]  bg-[#FDE0E0] border-[#8D4368] dark:text-[#FF74B0]  dark:bg-[#492228] dark:border-[#683950]">${data.getValue()}</div>`;
	}
	return "";
};

export const columnSetting = setColumnDefinition(
	{
		field: "check",
		title: "",
		width: 30,
		headerSort: false,
		cellClick: (e) => {
			e.preventDefault();
		},
		formatter: (cell: CellComponent) => {
			const index = cell.getRow().getPosition();
			if (cell.getValue() == true) {
				return `
					<div class="w-full h-full flex justify-center items-center">
						<input checked type="checkbox" id="totalHistoryGrid${index}" class="hidden"/>
						<label for="totalHistoryGrid${index}" class="block w-4 h-4 bg-[#282828] rounded-md border border-[#ABABAB] cursor-pointer"></label>
					</div>
				`;
			} else {
				return `
					<div class="w-full h-full flex justify-center items-center">
						<input type="checkbox" id="totalHistoryGrid${index}" class="hidden"/>
						<label for="totalHistoryGrid${index}" class="block w-4 h-4 bg-[#282828] rounded-md border border-[#ABABAB] cursor-pointer"></label>
					</div>
				`;
			}
		},
	},
	{
		field: "productNo",
		title: "생산번호",
		width: 180,
	},

	{
		field: "productResult",
		title: "구분",
		width: 100,
		formatter: resultFormatter,
	},

	{ field: "ai", title: "AI", width: 100, formatter: aiFormatter },

	{
		field: "ct",
		title: "CT",
		width: 120,
		formatter: ctFormatter,
	},
	{
		field: "loadSum",
		title: "Load SUM",
		width: 150,
		// formatter: (cell: CellComponent) => cell.getValue().toFixed(2),
		formatter: loadSumFormatter,
	},
	{
		field: "startTime",
		title: "시작일시",
	},
	{
		field: "endTime",
		title: "종료일시",
	},

	{
		field: "mainProgramNo",
		title: "Program No.",
		width: 150,
	},
	{
		field: "sov",
		title: "SOV",
		width: 100,
	},
	{
		field: "fov",
		title: "FOV",
		width: 100,
	},
	{
		field: "offsetX",
		title: "Offset-X",
		width: 120,
	},

	{
		field: "offsetZ",
		title: "Offset-Z",
		width: 120,
	},
);

export function updateChartData(
	dataSeries: XyDataSeries,
	dataSource: {
		time: number[];
		load: number[];
		predict: number[];
		xPos: number[];
		zPos: number[];
	},
) {
	dataSeries.clear();

	// AI 데이터인 경우 predict 데이터 추가
	if (dataSeries.id.includes("ai")) {
		dataSeries.appendRange(dataSource.time, dataSource.predict);
		return;
	}
	if (dataSeries.id.includes("XPos")) {
		dataSeries.appendRange(dataSource.time, dataSource.xPos);
		return;
	}
	if (dataSeries.id.includes("ZPos")) {
		dataSeries.appendRange(dataSource.time, dataSource.zPos);
		return;
	}

	// AI 데이터가 아닌 경우 load 데이터 추가
	if (!dataSeries.id.includes("ai")) {
		dataSeries.appendRange(dataSource.time, dataSource.load);
		return;
	}
}

export function removeChart({
	chartProperties,
	renderableSeriesInfo,
}: {
	chartProperties: IChartCommonParams;
	renderableSeriesInfo: { dataSeriesName: string; count: number };
}) {
	const selectedLoadRenderableSeries = chartProperties.sciChartSurface.renderableSeries.getById(
		renderableSeriesInfo.dataSeriesName,
	);
	const selectedAiRenderableSeries = chartProperties.sciChartSurface.renderableSeries.getById(
		renderableSeriesInfo.dataSeriesName + "ai",
	);
	const selectedXPosRenderableSeries = chartProperties.sciChartSurface.renderableSeries.getById(
		renderableSeriesInfo.dataSeriesName + "_XPos",
	);
	const selectedZPosRenderableSeries = chartProperties.sciChartSurface.renderableSeries.getById(
		renderableSeriesInfo.dataSeriesName + "_ZPos",
	);
	chartProperties.sciChartSurface.renderableSeries.remove(selectedLoadRenderableSeries);
	chartProperties.sciChartSurface.renderableSeries.remove(selectedAiRenderableSeries);
	chartProperties.sciChartSurface.renderableSeries.remove(selectedXPosRenderableSeries);
	chartProperties.sciChartSurface.renderableSeries.remove(selectedZPosRenderableSeries);
}

// 더미 데이터 생성 함수
// function generateDummyData() {
// 	const dataSource: {
// 		time: number[];
// 		load: number[];
// 		predict: number[];
// 	} = {
// 		time: [],
// 		load: [],
// 		predict: [],
// 	};

// 	const interval = 300; // 100ms 간격
// 	const totalPoints = (3 * 60 * 1000) / interval; // 3분간의 데이터를 100ms 간격으로 생성

// 	for (let i = 0; i < totalPoints; i++) {
// 		const currentTime = i * (interval / 1000); // 0부터 시작해 초 단위로 증가
// 		const loadValue = Math.floor(Math.random() * 40000); // 0 ~ 40000 사이의 load 값
// 		const predictValue = loadValue + Math.floor(Math.random() * 4000) + 1000; // load보다 1000 ~ 5000 큰 값

// 		// 데이터 추가
// 		dataSource.time.push(currentTime);
// 		dataSource.load.push(loadValue);
// 		dataSource.predict.push(predictValue);
// 	}

// 	return dataSource;
// }

export function initRenderableSeries({
	chartProperties,
	renderableSeriesInfo,
	lineStyle,
	legendModifier,
	yAxisId,
}: {
	chartProperties: IChartCommonParams;
	renderableSeriesInfo: { dataSeriesName: string; count: number };
	lineStyle: ILineChartStyle;
	legendModifier: LegendModifier;
	rawFilter: IFilterRawArgs;
	yAxisId?: string;
}) {
	const { dataSeriesName } = renderableSeriesInfo;
	const loadSeriesId = dataSeriesName;
	const aiSeriesId = dataSeriesName + "ai";
	const xPosSeriesId = dataSeriesName + "_XPos";
	const zPosSeriesId = dataSeriesName + "_ZPos";

	//#region DataSeries 초기화
	const loadDataSeries = initDataSeries(chartProperties.wasmContext, {
		dataSeriesName: loadSeriesId,
	});

	const aiDataSeries = initDataSeries(chartProperties.wasmContext, {
		dataSeriesName: aiSeriesId,
	});

	const xPosDataSeries = initDataSeries(chartProperties.wasmContext, {
		dataSeriesName: xPosSeriesId,
	});

	const zPosDataSeries = initDataSeries(chartProperties.wasmContext, {
		dataSeriesName: zPosSeriesId,
	});
	//#endregion

	//#region RenderableSeries 초기화
	const loadRenderableSeries = createLineRenderableSeries(
		chartProperties.wasmContext,
		loadDataSeries,
		{
			style: lineStyle,
			id: loadSeriesId,
		},
	);

	loadRenderableSeries.rolloverModifierProps.width = 330;
	loadRenderableSeries.rolloverModifierProps.height = 21;
	loadRenderableSeries.rolloverModifierProps.tooltipColor = "#00000066";
	loadRenderableSeries.rolloverModifierProps.tooltipTextColor = lineStyle.strokeColor;

	const aiRenderableSeries = createLineRenderableSeries(chartProperties.wasmContext, aiDataSeries, {
		style: {
			...lineStyle,
			strokeColor: lineStyle.strokeColor + "99",
			thickness: 1,
			strokeDashArray: [2, 3],
		},
		id: aiSeriesId,
	});
	aiRenderableSeries.isVisible = false;
	aiRenderableSeries.rolloverModifierProps.width = 0;
	aiRenderableSeries.rolloverModifierProps.height = 0;
	aiRenderableSeries.rolloverModifierProps.tooltipColor = "transparent";
	aiRenderableSeries.rolloverModifierProps.tooltipTextColor = "transparent";

	const xPosRenderableSeries = createLineRenderableSeries(
		chartProperties.wasmContext,
		xPosDataSeries,
		{
			style: {
				...lineStyle,
				strokeColor: lineStyle.strokeColor + "66",
				thickness: 1,
			},
			id: xPosSeriesId,
			yAxisId,
		},
	);

	xPosRenderableSeries.isVisible = false;
	xPosRenderableSeries.rolloverModifierProps.width = 330;
	xPosRenderableSeries.rolloverModifierProps.height = 21;
	xPosRenderableSeries.rolloverModifierProps.tooltipColor = "#00000033";
	xPosRenderableSeries.rolloverModifierProps.tooltipTextColor = lineStyle.strokeColor;

	const zPosRenderableSeries = createLineRenderableSeries(
		chartProperties.wasmContext,
		zPosDataSeries,
		{
			style: {
				...lineStyle,
				strokeColor: lineStyle.strokeColor + "66",
				thickness: 1,
			},
			id: zPosSeriesId,
			yAxisId,
		},
	);

	zPosRenderableSeries.isVisible = false;
	zPosRenderableSeries.rolloverModifierProps.width = 330;
	zPosRenderableSeries.rolloverModifierProps.height = 21;
	zPosRenderableSeries.rolloverModifierProps.tooltipColor = "#00000066";
	zPosRenderableSeries.rolloverModifierProps.tooltipTextColor = lineStyle.strokeColor;
	//#endregion

	// 아래에서 실행하면 화면에서 AI Legend 가 사라지는 잔상이 남으므로 여기서 실행
	if (legendModifier) {
		legendModifier.includeSeries(loadRenderableSeries, true);
		legendModifier.includeSeries(aiRenderableSeries, false);
		legendModifier.includeSeries(xPosRenderableSeries, false);
		legendModifier.includeSeries(zPosRenderableSeries, false);
	}

	addChartRenderableSeries(chartProperties.sciChartSurface, loadRenderableSeries);
	addChartRenderableSeries(chartProperties.sciChartSurface, aiRenderableSeries);
	addChartRenderableSeries(chartProperties.sciChartSurface, xPosRenderableSeries);
	addChartRenderableSeries(chartProperties.sciChartSurface, zPosRenderableSeries);
	renderableSeriesInfo.count = chartProperties.sciChartSurface.renderableSeries.size() / 4; // load, ai 두개 이므로 아래에서 count 는 1/4 해준다.

	if (!legendModifier) {
		legendModifier = addLegendModifier({
			chartSurface: chartProperties.sciChartSurface,
			placementDivId: "productHistoryChartLegend",
			orientation: 0,
			excludeRenderableSeries: [aiRenderableSeries, xPosRenderableSeries, zPosRenderableSeries],
			isCheckedChagedCallback: (series, isChecked) => {
				const seriesId = series.getDataSeriesName();
				const aiSeriesId = seriesId + "ai";
				const xPosSeriesId = seriesId + "_XPos";
				const zPosSeriesId = seriesId + "_ZPos";
				const aiSeries = chartProperties.sciChartSurface.renderableSeries.getById(aiSeriesId);
				const xPosSeries = chartProperties.sciChartSurface.renderableSeries.getById(xPosSeriesId);
				const zPosSeries = chartProperties.sciChartSurface.renderableSeries.getById(zPosSeriesId);
				const aiCheckBoxElement = document.getElementById(aiSeriesId) as HTMLInputElement;
				const xPosCheckBoxElement = document.getElementById(xPosSeriesId) as HTMLInputElement;
				const zPosCheckBoxElement = document.getElementById(zPosSeriesId) as HTMLInputElement;
				if (isChecked == true) {
					if (aiCheckBoxElement.checked == true) {
						aiSeries.isVisible = true;
					}
					if (xPosCheckBoxElement.checked == true) {
						xPosSeries.isVisible = true;
					}
					if (zPosCheckBoxElement.checked == true) {
						zPosSeries.isVisible = true;
					}
				}

				if (isChecked == false) {
					aiSeries.isVisible = false;
					xPosSeries.isVisible = false;
					zPosSeries.isVisible = false;
					aiCheckBoxElement.checked = false;
					xPosCheckBoxElement.checked = false;
					zPosCheckBoxElement.checked = false;

					return;
				}
			},
		});
	}

	return { loadDataSeries, aiDataSeries, xPosDataSeries, zPosDataSeries, legendModifier };
}

export function parseChartData(chartDataRequest: TRawsResponse) {
	const chartData: {
		time: number[];
		load: number[];
		predict: number[];
		xPos: number[];
		zPos: number[];
	} = {
		time: [],
		load: [],
		predict: [],
		xPos: [],
		zPos: [],
	};
	chartDataRequest.response.forEach((item: IGqlRawsData) => {
		chartData.time.push(item.Index);
		chartData.load.push(item.Load);
		chartData.predict.push(item.Predict);
		chartData.xPos.push(item.SV_X_Pos / Number(PUBLIC_X_Z_SCALING_FACTOR));
		chartData.zPos.push(item.SV_Z_Pos / Number(PUBLIC_X_Z_SCALING_FACTOR));
	});

	return chartData;
}

export async function setVisibleRange(
	renderableSeriesInfo: { count: number },
	chartProperties: IChartCommonParams,
	chartData: { time: number[] },
) {
	let newMaxVisibleRange = 200;
	if (renderableSeriesInfo.count == 1) {
		newMaxVisibleRange = chartData.time[chartData.time.length - 1] ?? newMaxVisibleRange;
	}

	if (renderableSeriesInfo.count > 1) {
		let currentMaxVisibleRange =
			chartProperties.sciChartSurface.xAxes.get(0).visibleRange?.max ?? newMaxVisibleRange;
		let receiveMaxVisibleRange = chartData.time[chartData.time.length - 1] ?? newMaxVisibleRange;
		newMaxVisibleRange = Math.max(currentMaxVisibleRange, receiveMaxVisibleRange);
	}
	chartProperties.sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(
		0,
		newMaxVisibleRange,
	);
}
