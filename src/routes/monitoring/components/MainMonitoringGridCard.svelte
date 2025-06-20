<script lang="ts">
	import Grid from '$lib/components/grid/Grid.svelte';
	import dayjs from 'dayjs';
	import CommonCard from '$lib/components/card/CommonCard.svelte';
	import { makeDateString, makeDateTimeString } from '$lib/common/date';
	import { getAbnormalReportData } from '$lib/api/graphql/abnormal';
	import { subTableFormatter } from '$lib/components/grid/grid';
	import type { IProductHistoryData } from '$lib/api/graphql/product/schema';
	import type {
		IAbnormalData,
		IAbnormalReportData,
		IFilterAbnormalArgs
	} from '$lib/api/graphql/abnormal/schema';
	import type { IFilterCommonInput } from '$lib/api/graphql/schema';
	import {
		Tabulator,
		type RowComponent,
		type ColumnDefinition,
		type CellComponent
	} from 'tabulator-tables';
	import {
		ABNORMAL_BROKEN,
		ABNORMAL_BROKEN_DESC,
		ABNORMAL_LOAD,
		ABNORMAL_LOAD_DESC,
		ABNORMAL_QUALITY,
		ABNORMAL_QUALITY_DESC,
		ABNORMAL_TOOL,
		ABNORMAL_TOOL_DESC,
		ABNORMAL_WEAR,
		ABNORMAL_WEAR_DESC,
		PRODUCT_RESULT_NG_DESC,
		PRODUCT_RESULT_OK_DESC,
		PRODUCT_RESULT_WARN_DESC,
		TOOL_STATUS_WARN
	} from '../../../constants/code';
	import Loading from '$lib/components/loading/Loading.svelte';
	import { isDarkMode } from '../../../dashboard/provider/store';
	import type { IPieChartData } from '$lib/scichart/chartTypes/pie/type';
	import { columnSetting, abnormalSubTableColumnSetting } from '../scripts/mainMonitoringGrid';

	export let IsAbnormalErrorEffect: boolean = false;
	export let data: IProductHistoryData[] | undefined; // Main Monitoring Grid Data
	export let operationInfo: IFilterCommonInput;

	//#region Constants
	const colorLinearGradientList: [string, string][] = [
		['#faa96d', '#d7762e'],
		['#85edaf', '#1bca85'],
		['#68a0ca', '#92c8f2'],
		['#672bd3', '#b489fb'],
		['#09b0b1', '#009596'],
		['#5ab0ff', '#0e6ed0'],
		['#ffd780', '#dda630']
	];

	// Column Setting ( Sub Table 에 Event Handler 등록을 위해 Column Setting 을 Parsing)
	let parsedColumnSetting: ColumnDefinition[] = columnSetting.map((column) => {
		if (column.field === 'productNo') {
			column.formatter = (cell: CellComponent) =>
				subTableFormatter(cell, abnormalSubTableColumnSetting, subTableRowDblClickCallBackFunc);
		}
		return column;
	});

	let dataGrid: Tabulator;
	let isShowAbnormalModal: boolean = false;
	let isAbnormalModalHistoryGridLoading: boolean = false;
	let abnormalModalHistoryData: IAbnormalData[] | undefined = undefined;
	let abnormalModalPieChartData: IPieChartData[] | undefined = undefined;
	let abnormalStart: string;
	let abnormalEnd: string;

	let abnormalModalFilter: IFilterAbnormalArgs;

	// Main Monitoring Grid Data Parsing
	$: if (data) data = [...parseData(data)];

	$: {
		if ($isDarkMode) {
		} else if (!$isDarkMode) {
		}
	}

	//#region Function
	function parseData(data: IProductHistoryData[]): IProductHistoryData[] {
		if (!data) return [];
		let parsedData = data.map((info) => {
			info.endTime = makeDateTimeString(info.endTime, true);
			info.startTime = makeDateTimeString(info.startTime, true);
			info.ct = info.ct > 1000 ? info.ct / 1_000_000_000 : info.ct;

			let result: string = PRODUCT_RESULT_OK_DESC;
			if (info.abnormals.length > 0) {
				result = info.abnormals.some(
					(v) =>
						v.abnormalCode != ABNORMAL_LOAD &&
						v.abnormalCode != ABNORMAL_TOOL &&
						v.abnormalCode != ABNORMAL_LOAD_DESC &&
						v.abnormalCode != ABNORMAL_TOOL_DESC
				)
					? PRODUCT_RESULT_NG_DESC
					: PRODUCT_RESULT_WARN_DESC;
				info.abnormals = info.abnormals.map((abnormal) => {
					abnormal.abnormalCode =
						abnormal.abnormalCode == ABNORMAL_QUALITY_DESC ||
						abnormal.abnormalCode == ABNORMAL_LOAD_DESC ||
						abnormal.abnormalCode == ABNORMAL_TOOL_DESC
							? abnormal.abnormalCode
							: abnormal.abnormalCode == ABNORMAL_QUALITY
								? ABNORMAL_QUALITY_DESC
								: abnormal.abnormalCode == ABNORMAL_LOAD
									? ABNORMAL_LOAD_DESC
									: ABNORMAL_TOOL_DESC;
					abnormal.abnormalBeginDate = makeDateTimeString(abnormal.abnormalBeginDate, true);
					abnormal.abnormalEndDate = makeDateTimeString(abnormal.abnormalEndDate, true);
					abnormal.abnormalDescription = initAbnormalDescription(abnormal);

					return abnormal;
				});
			}
			info.result = result;

			return info;
		});
		return parsedData;
	}

	function initAbnormalDescription(abnormal: IAbnormalData) {
		if (
			(abnormal.abnormalCode == ABNORMAL_LOAD || abnormal.abnormalCode == ABNORMAL_LOAD_DESC) &&
			abnormal.abnormalDescription.length > 10
		) {
			return abnormal.abnormalDescription.substring(0, 10);
		}

		if (
			abnormal.abnormalCode == ABNORMAL_QUALITY ||
			abnormal.abnormalCode == ABNORMAL_QUALITY_DESC
		) {
			return `${PRODUCT_RESULT_NG_DESC} ${(abnormal.abnormalValue * 100).toFixed(0)}%`;
		}

		if (abnormal.abnormalLevel == ABNORMAL_WEAR) {
			return `${abnormal.abnormalTool} ${ABNORMAL_WEAR_DESC} ${(abnormal.abnormalValue * 100).toFixed(0)}%`;
		}

		if (abnormal.abnormalLevel == ABNORMAL_BROKEN) {
			return `${abnormal.abnormalTool} ${ABNORMAL_BROKEN_DESC} ${(abnormal.abnormalValue * 100).toFixed(0)}%`;
		}

		if (
			(abnormal.abnormalCode == ABNORMAL_TOOL || abnormal.abnormalCode == ABNORMAL_TOOL_DESC) &&
			abnormal.abnormalLevel == TOOL_STATUS_WARN &&
			abnormal.abnormalDescription.includes('부하')
		) {
			return `${abnormal.abnormalTool} 부하 경고 ${(abnormal.abnormalValue * 100).toFixed(0)}%`;
		}

		return abnormal.abnormalDescription;
	}

	// Abnormal Modal Button 클릭
	async function onClickAbnormalModal() {
		isShowAbnormalModal = true;

		// 오늘 날짜와 내일 날짜를 구함
		abnormalStart = makeDateString(dayjs().toISOString());
		abnormalEnd = makeDateString(dayjs().add(1, 'day').toISOString());

		// Data 초기화
		abnormalModalHistoryData = undefined;
		abnormalModalPieChartData = undefined;

		// 이상감지 이력 데이터 요청
		// await getAbnormalHistoryData(abnormalStart, abnormalEnd);
		abnormalModalFilter = {
			commonFilter: operationInfo,
			rangeStart: abnormalStart,
			rangeEnd: abnormalEnd
		};

		// // 이상감지 통계 데이터 요청
		await getAbnormalStatisticData(abnormalStart, abnormalEnd);
	}

	// Main Table Row Double Click Event Handler
	async function rowDblClickCallBackFunc(row: RowComponent) {
		const rowData = row.getData() as IProductHistoryData;
		if (rowData.result === PRODUCT_RESULT_OK_DESC) return;

		isShowAbnormalModal = true;

		// Data 초기화
		abnormalModalHistoryData = undefined;
		abnormalModalPieChartData = undefined;

		// 이상감지 이력 데이터 요청
		// await getRowAbnormalHistoryData(rowData.productNo);
		abnormalModalFilter = {
			commonFilter: operationInfo,
			productNo: rowData.productNo
		};

		// 이상감지 통계 데이터 요청
		await getRowAbnormalStatisticData(rowData.startTime, rowData.endTime);
	}

	// SubTable Row Double Click Event Handler
	async function subTableRowDblClickCallBackFunc(row: RowComponent) {
		const rowData = row.getData();

		isShowAbnormalModal = true;

		// Data 초기화
		abnormalModalHistoryData = undefined;
		abnormalModalPieChartData = undefined;

		// await getAbnormalHistoryData(rowData.abnormalBeginDate, rowData.abnormalEndDate);
		abnormalModalFilter = {
			commonFilter: operationInfo,
			rangeStart: rowData.abnormalBeginDate,
			rangeEnd: rowData.abnormalEndDate
		};

		await getAbnormalStatisticData(rowData.abnormalBeginDate, rowData.abnormalEndDate);
	}

	// Modal Open 시, 이상감지 이력 데이터 요청
	// async function getAbnormalHistoryData(rangeStart: string, rangeEnd: string) {
	// 	// 이상감지 이력 데이터 요청
	// 	isAbnormalModalHistoryGridLoading = true;
	// 	let getAbnormalHistoryDataRequest = await getAbnormalData({
	// 		commonFilter: operationInfo,
	// 		rangeStart,
	// 		rangeEnd
	// 	});
	// 	isAbnormalModalHistoryGridLoading = false;

	// 	// Data 가 초기화 되어있을 때만.
	// 	if (abnormalModalHistoryData == undefined) {
	// 		abnormalModalHistoryData = getAbnormalHistoryDataRequest.response;
	// 	}
	// }

	// Modal Open 시,  이상감지 통계 데이터 요청
	async function getAbnormalStatisticData(rangeStart: string, rangeEnd: string) {
		let getAbnormalReportDataRequest = await getAbnormalReportData({
			commonFilter: operationInfo,
			rangeStart,
			rangeEnd
		});

		if (abnormalModalPieChartData == undefined) {
			abnormalModalPieChartData = getAbnormalReportDataRequest.response.map(
				(data: IAbnormalReportData, idx: number) => {
					return parsePieChartData(data, idx);
				}
			);
		}
	}

	// SubTable Row Dbl Click 시, 이상감지 이력 데이터 요청
	// async function getRowAbnormalHistoryData(productNo: string) {
	// 	// 이상감지 이력 데이터 요청
	// 	isAbnormalModalHistoryGridLoading = true;
	// 	let getAbnormalHistoryDataRequest = await getAbnormalData({
	// 		commonFilter: operationInfo,
	// 		productNo
	// 	});
	// 	isAbnormalModalHistoryGridLoading = false;

	// 	// Data 가 초기화 되어있을 때만.
	// 	if (abnormalModalHistoryData == undefined) {
	// 		abnormalModalHistoryData = getAbnormalHistoryDataRequest.response;
	// 	}
	// }

	// SubTable Row Dbl Click 시, 이상감지 통계 데이터 요청
	async function getRowAbnormalStatisticData(rangeStart: string, rangeEnd: string) {
		let getAbnormalReportDataRequest = await getAbnormalReportData({
			commonFilter: operationInfo,
			rangeStart,
			rangeEnd
		});

		// Data 가 초기화 되어있을 때만.
		if (abnormalModalPieChartData == undefined) {
			abnormalModalPieChartData = getAbnormalReportDataRequest.response.map(
				(data: IAbnormalReportData, idx: number) => {
					return parsePieChartData(data, idx);
				}
			);
		}
	}

	// Pie Chart 데이터 Parsing
	function parsePieChartData(data: IAbnormalReportData, idx: number): IPieChartData {
		return {
			// text: ((data.abnormalTool || '') + ' ' + data.abnormalCode).trim(),
			text: parseAbnormalCodeToDesc(data.abnormalCode.trim()),
			value: data.abnormalCount,
			colorLinearGradient: {
				from: colorLinearGradientList[idx % colorLinearGradientList.length][0],
				to: colorLinearGradientList[idx % colorLinearGradientList.length][1]
			}
		};
	}

	function parseAbnormalCodeToDesc(abnormalCode: string): string {
		switch (abnormalCode) {
			case ABNORMAL_QUALITY:
				return '품질';
			case ABNORMAL_LOAD:
				return '부하';
			case ABNORMAL_TOOL:
				return '공구';
			case ABNORMAL_WEAR:
				return '마모';
			case ABNORMAL_BROKEN:
				return '파손';
			default:
				return '기타';
		}
	}
	//#endregion
</script>

<div class="h-full overflow-hidden">
	<CommonCard
		isModalBtn={true}
		caption="생산 정보"
		isErrorEffect={IsAbnormalErrorEffect}
		onClick={onClickAbnormalModal}
	>
		{#if data}
			<div class="h-full w-[98%] overflow-hidden">
				<Grid
					bind:dataGrid
					{data}
					{rowDblClickCallBackFunc}
					tableId="monitoringAbnormalsGrid"
					columnSetting={parsedColumnSetting}
				/>
			</div>
		{:else}
			<Loading gradationEffect={{ color: 'none' }} />
		{/if}
	</CommonCard>
</div>
