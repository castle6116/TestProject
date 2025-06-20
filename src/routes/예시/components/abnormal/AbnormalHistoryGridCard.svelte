<script lang="ts">
	import { Tabulator, type RowComponent } from 'tabulator-tables';
	import { columnSetting } from '../../scripts/abnormalHistoryGrid';
	import Grid from '$lib/components/grid/Grid.svelte';
	import type { IAbnormalData, IFilterAbnormalArgs } from '$lib/api/graphql/abnormal/schema';
	import { getChartData } from '$lib/api/graphql/raw';
	import { convertStringToDateTime, makeDateTimeString } from '$lib/common/date';
	import type { IGqlRawsData } from '$lib/api/graphql/raw/schema';
	import { onDestroy, onMount } from 'svelte';
	import Loading from '$lib/components/loading/Loading.svelte';
	import type { IFilterCommonInput } from '$lib/api/graphql/schema';
	import { createHTMLElement } from '$lib/components/grid/grid';
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
		TOOL_STATUS_WARN
	} from '$constants/code';
	import { getAbnormalQuery } from '$lib/api/graphql/abnormal';
	import { PUBLIC_GRAPHQL_URL } from '$env/static/public';
	import { getProductHistoryData } from '$lib/api/graphql/product';

	export let historyData: IAbnormalData[] | undefined;
	export let isHistoryGridLoading: boolean;
	export let dataGrid: Tabulator;
	export let chartData:
		| { time: number[]; load: number[]; predict: number[]; loss: number[]; productNo?: string }
		| undefined;
	export let operationInfo: IFilterCommonInput;
	export let abnormalTimeInfo: { startTime: string; endTime: string } | undefined;
	export let abnormalFilter: IFilterAbnormalArgs;

	let gridData: IAbnormalData[] | undefined;
	let queryFilter: IFilterAbnormalArgs;

	//#region Reactive
	// Data parsing
	$: if (historyData) {
		gridData = [
			...historyData.map((abnormal) => {
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
			})
		];
	}

	$: {
		if (dataGrid && abnormalFilter) {
			queryFilter = abnormalFilter;
			dataGrid.setData();
		}
	}
	//#endregion

	//#region onMount
	onMount(async () => {});
	//#endregion

	//#region onDestroy
	onDestroy(() => {
		dataGrid?.destroy();
	});
	//#endregion

	//#region Function

	// Table 이 생성된 후 작동할 이벤트 리스너 등록
	async function tableBuiltEventListener(row: RowComponent) {
		row.select();
		await rowClickCallBackPromiseFunc(row);
	}

	// Row 클릭 시 작동할 콜백 함수
	async function rowClickCallBackPromiseFunc(row: RowComponent) {
		let rowData: IAbnormalData = row.getData() as IAbnormalData;

		// Chart Data 초기화
		chartData = undefined;

		// 이상감지 시간 정보 저장
		abnormalTimeInfo = {
			startTime: rowData.abnormalBeginDate,
			endTime: rowData.abnormalEndDate
		};

		// 품질 이상일 경우, 알람 정보 표시하지 않음
		if (rowData.abnormalCode == ABNORMAL_QUALITY_DESC) {
			abnormalTimeInfo = undefined;
		}

		// 공정 시간을 가져오기 위한 Product History Data 요청
		let getProductHistoryDataRequest = await getProductHistoryData(
			{ ...operationInfo },
			{ productNo: rowData.productNo }
		);

		// 공정 시간 정보 저장
		let productStartTime: string =
			getProductHistoryDataRequest.response[0]?.startTime || rowData.abnormalBeginDate;
		let productEndTime: string =
			getProductHistoryDataRequest.response[0]?.endTime || rowData.abnormalEndDate;

		// Chart Data 요청
		let getChartDataRequest = await getChartData({
			commonFilter: operationInfo,
			rangeStart: productStartTime,
			rangeStop: productEndTime
		});

		// Chart Data Push
		chartData = { time: [], load: [], predict: [], loss: [], productNo: rowData.productNo };
		getChartDataRequest.response.forEach((item: IGqlRawsData) => {
			chartData!.time.push(convertStringToDateTime(item.time));
			chartData!.load.push(item.load as number);
			chartData!.predict.push(item.predict as number);
			chartData!.loss.push(item.loss as number);
		});
	}

	// Pagination Counter Custom Element
	function customPaginationCounter(
		_pageSize: number,
		_currentRow: number,
		currentPage: number,
		_totalRows: number,
		totalPages: number
	) {
		let counterElement = createHTMLElement({
			tag: 'span',
			textContent: `${currentPage} / ${totalPages} pages`
		});
		counterElement.style.position = 'absolute';
		counterElement.style.right = '40px';
		counterElement.style.bottom = '14px';
		counterElement.style.color = '#8f8b8b';
		return counterElement;
	}
	//#endregion

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
</script>

<div class="h-[101%] w-full">
	{#if isHistoryGridLoading}
		<Loading gradationEffect={{ color: '#121416', duration: '3s' }} />
	{:else}
		<Grid
			bind:dataGrid
			bind:data={gridData}
			{columnSetting}
			{rowClickCallBackPromiseFunc}
			{tableBuiltEventListener}
			{customPaginationCounter}
			paginationMode="remote"
			paginationSize={9}
			ajaxURL={PUBLIC_GRAPHQL_URL}
			ajaxConfig="POST"
			ajaxContentType={{
				headers: {
					Accept: 'application/json', //tell the server we need JSON back
					'Content-type': 'application/json; charset=utf-8' //set the character encoding of the request
				},
				body: (_url, _config, params) => {
					// console.log('Ajax Params', params);
					let currentFilter = {
						...queryFilter,
						page: params.page,
						count: params.size
					};

					if (params.filter && params.filter.length > 0) {
						let filterAbnormalCode = '';
						let filterCode = '';
						let filterKeyword = '';

						if (params.filter.findIndex((f) => f.field == 'all') >= 0) {
							filterKeyword = params.filter.find((f) => f.field == 'all').value;
						}

						if (params.filter.findIndex((f) => f.field == 'abnormalCode') >= 0) {
							filterAbnormalCode = params.filter.find((f) => f.field == 'abnormalCode').value;
						}

						if (filterAbnormalCode == ABNORMAL_QUALITY_DESC) {
							filterCode = ABNORMAL_QUALITY;
						} else if (filterAbnormalCode == ABNORMAL_TOOL_DESC) {
							filterCode = ABNORMAL_TOOL;
						} else if (filterAbnormalCode == ABNORMAL_LOAD_DESC) {
							filterCode = ABNORMAL_LOAD;
						}

						if (filterCode != '') {
							currentFilter.abnormalCode = filterCode;
						}

						if (filterKeyword != '') {
							currentFilter.filterKeyword = filterKeyword;
						}
					}

					if (params.sort && params.sort.length > 0) {
						currentFilter.sortInput = {
							sortColumn: params.sort[0].field,
							sortDirection: params.sort[0].dir
						};
					} else {
						currentFilter.sortInput = {
							sortColumn: 'abnormalBeginDate',
							sortDirection: 'desc'
						};
					}

					const query = getAbnormalQuery(currentFilter);

					return JSON.stringify({ query });
				}
			}}
			ajaxResponse={function (_url, _params, response) {
				if (response && response.data) {
					return {
						last_page: response.data.response.pageCount,
						data: [
							...response.data.response.abnormals.map((abnormal) => {
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
							})
						]
					};
				}

				return {
					last_page: 1,
					data: []
				};
			}}
			tableId="abnormalHistoryGrid"
			tableStyle={{
				rowStyle: {
					tableRowFontSize: '12px'
				}
			}}
		/>
	{/if}
</div>
