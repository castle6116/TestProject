<script lang="ts">
	//#region import
	import './style.css';
	import { makeStyle } from './grid';
	import { TabulatorFull as Tabulator, type ColumnDefinition } from 'tabulator-tables';
	import type { ITableStyle } from './schema';
	import { makeCustomElement } from './grid';
	import { onMount } from 'svelte';
	import type {
		AjaxContentType,
		CellComponent,
		HttpMethod,
		RowComponent,
		SortMode
	} from 'tabulator-tables';
	import { isDarkMode } from '../../../dashboard/provider/store';
	//#endregion

	//#region export
	export let tableId: string;
	export let columnSetting: ColumnDefinition[];
	export let dataGrid: Tabulator;
	export let data: Array<unknown> | undefined = undefined;
	// export let firstRowComponent: RowComponent | undefined = undefined;
	export let rowHeight: number | undefined = undefined;
	export let tableStyle: ITableStyle | undefined = undefined;
	export let paginationMode: SortMode = 'local'; // "local" or "remote"
	export let paginationSize: number | undefined = undefined;
	export let customPaginationCounter:
		| ((
				pageSize: number,
				currentRow: number,
				currentPage: number,
				totalRows: number,
				totalPages: number
		  ) => string | HTMLElement)
		| undefined = undefined;
	// Row Header CheckBox Show 여부
	export let isCheckBoxShow: boolean = false;
	export let selectableRows: number | 'highlight' | boolean = 1;
	export let isMovableRows: boolean = false;
	export let gridHeight: string = '99%';

	// Event Listener 등록 함수
	export let rowClickCallBackFunc: ((args: any) => void) | undefined = undefined;
	export let rowClickCallBackPromiseFunc: ((args: any) => Promise<any>) | undefined = undefined;
	export let rowDblClickCallBackFunc: ((args: any) => void) | undefined = undefined;
	export let cellEditedEventListener: ((cell: CellComponent) => void) | undefined = undefined;
	export let rowAddedEventListener: ((row: RowComponent) => void) | undefined = undefined;
	export let rowDeletedEventListener: ((row: RowComponent) => void) | undefined = undefined;
	export let rowMovedEventListener: ((row: RowComponent) => void) | undefined = undefined;
	export let tableBuiltEventListener: ((row: RowComponent) => void) | undefined = undefined;
	export let tableFilteredEventListener:
		| ((row: RowComponent | RowComponent[]) => void)
		| undefined = undefined;
	// GraphQL 사용 시
	export let ajaxURL: string | undefined = undefined;
	export let ajaxConfig: HttpMethod | undefined = undefined;
	export let ajaxContentType: AjaxContentType | undefined = undefined;
	export let ajaxResponse: ((url, config, response) => any) | undefined = undefined;

	// Ex) ajaxContentType: {
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: (url, config, params) => {
	// 				// url - the URL of the request
	// 				// config - the request configuration object
	// 				// params - the request parameters object
	// 				// return JSON.stringify({query, variables, id})
	// 			}
	// 		},
	//#endregion

	//#region variable
	let tableElement: Element | null;
	let tableRowHeight: string | undefined = rowHeight ? `${rowHeight}px` : undefined;
	let style: string = makeStyle({
		isDarkMode: $isDarkMode,
		style: tableStyle,
		tableRowHeight
	});

	$: totalDataLength = data?.length || 100;

	//#endregion
	$: {
		// DataGrid가 생성되면,
		if (dataGrid) {
			// DarkMode 가 True 일 때,
			if ($isDarkMode) {
				for (let i = 0; i < totalDataLength; i++) {
					if (document.getElementById('subtable-holder' + i))
						document.getElementById('subtable-holder' + i)!.style.background = '#141517';
				}
				// setStyle({
				// 	tableId,
				// 	isDarkMode: $isDarkMode,
				// });
				style = makeStyle({
					isDarkMode: $isDarkMode,
					style: tableStyle,
					tableRowHeight
				});
			}
			// DarkMode 가 False 일 때,
			else {
				for (let i = 0; i < totalDataLength; i++) {
					if (document.getElementById('subtable-holder' + i))
						document.getElementById('subtable-holder' + i)!.style.background = '#F2F3FF';
				}
				// setStyle({
				// 	tableId,
				// 	isDarkMode: $isDarkMode,
				// });
				style = makeStyle({
					isDarkMode: $isDarkMode,
					style: tableStyle,
					tableRowHeight
				});
			}
		}
	}

	//#endregion

	//#region onMount
	onMount(() => {
		tableElement = document.getElementById(tableId);
	});
	//#endregion

	//#region reactive
	$: {
		if (tableElement && (data || ajaxURL)) {
			dataGrid?.destroy();

			makeDataGrid({
				tableId,
				columnSetting
			});
			data = undefined;
		}
	}

	//#endregion

	//#region function
	const makeDataGrid = (props: { tableId: string; columnSetting: ColumnDefinition[] }) => {
		const { tableId } = props;

		dataGrid = new Tabulator(`#${tableId}`, {
			height: gridHeight,
			maxHeight: '99%',
			selectableRows,
			paginationMode: paginationMode, // "local" or "remote",
			pagination: paginationSize ? true : false,
			paginationSize: paginationSize,
			paginationCounter: customPaginationCounter || undefined,
			paginationButtonCount: 10,
			// ajaxURL 이 있으면, data는 undefined로 설정
			data: ajaxURL ? undefined : data,

			// Graphql 사용시
			ajaxURL,
			ajaxConfig,
			ajaxContentType,
			ajaxResponse: ajaxResponse,
			filterMode: ajaxURL ? 'remote' : 'local',
			sortMode: ajaxURL ? 'remote' : 'local',

			movableRows: isMovableRows,
			rowHeight: rowHeight,
			// Row Format (SubTable) 설정
			rowFormatter: function (row: RowComponent): void {
				const subTableHolderDiv = document.createElement('div');
				subTableHolderDiv.classList.add('subtable-holder');
				subTableHolderDiv.id = 'subtable-holder' + row.getPosition();
				subTableHolderDiv.style.paddingLeft = '15px';
				subTableHolderDiv.style.paddingRight = '15px';
				// 서브테이블 배경색 설정
				$isDarkMode
					? (subTableHolderDiv.style.background = '#141517')
					: (subTableHolderDiv.style.background = '#F2F3FF');
				subTableHolderDiv.style.width = '100%';
				subTableHolderDiv.style.display = 'none';

				const subTableDiv = document.createElement('div');
				subTableDiv.classList.add('subtable');
				subTableHolderDiv.appendChild(subTableDiv);

				row.getElement().appendChild(subTableHolderDiv);
			},
			rowHeader: isCheckBoxShow
				? {
						headerSort: false,
						resizable: false,
						frozen: true,
						width: 40,
						headerHozAlign: 'center',
						hozAlign: 'center',
						formatter: 'rowSelection',
						// titleFormatter: 'rowSelection',
						cellClick: function (_, cell) {
							cell.getRow().toggleSelect();
						}
					}
				: undefined,
			placeholder: makeCustomElement({ tag: 'span' }, 'loader'),
			layout: 'fitColumns',
			columns: columnSetting,
			locale: true,
			langs: {
				'ko-kr': {
					pagination: {
						first: '<<',
						first_title: 'First Page',
						last: '>>',
						last_title: 'Last Page',
						prev: '이전',
						prev_title: 'Prev Page',
						next: '다음',
						next_title: 'Next Page',
						all: 'All'
					}
				}
			}
		});

		//#region Add Event Listener
		// Row 클릭 시 이벤트
		dataGrid.on('rowClick', async (_e, row: RowComponent) => {
			if (rowClickCallBackFunc) rowClickCallBackFunc(row);
			if (rowClickCallBackPromiseFunc) {
				await rowClickCallBackPromiseFunc(row);
			}
		});

		// Row 더블클릭 시 이벤트
		dataGrid.on('rowDblClick', (_e, row: RowComponent) => {
			if (rowDblClickCallBackFunc) rowDblClickCallBackFunc(row);
		});

		// Cell 수정 시 이벤트
		dataGrid.on('cellEdited', (cell) => {
			if (cellEditedEventListener) {
				cellEditedEventListener(cell);
			}
		});

		// Row 추가 시 이벤트
		dataGrid.on('rowAdded', (row: RowComponent) => {
			if (rowAddedEventListener) {
				rowAddedEventListener(row);
			}
		});

		// Row 삭제 시 이벤트
		dataGrid.on('rowDeleted', (row: RowComponent) => {
			if (rowDeletedEventListener) {
				rowDeletedEventListener(row);
			}
		});

		// Row 이동 시 이벤트
		dataGrid.on('rowMoved', (row: RowComponent) => {
			if (rowMovedEventListener) {
				rowMovedEventListener(row);
			}
		});

		// Table 생성 완료 시 이벤트
		dataGrid.on('tableBuilt', () => {
			if (tableBuiltEventListener) {
				const rows = dataGrid.getRows()[0];
				tableBuiltEventListener(rows);
			}
		});

		dataGrid.on('dataFiltered', () => {
			if (tableFilteredEventListener) {
				const rows = dataGrid.getRows();
				tableFilteredEventListener(rows);
			}
		});
		//#endregion
	};

	//#endregion
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id={tableId} class="h-full w-full overflow-scroll rounded-b-md" {style} />
