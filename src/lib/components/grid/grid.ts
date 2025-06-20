import {
	Tabulator,
	type ColumnDefinition,
	type CellComponent,
	type RowComponent
} from 'tabulator-tables';
import type { ITableStyle } from './schema';

//#region Table Basic Style
const tableBasicStyle: Required<ITableStyle> = {
	//#region Body Style
	bodyStyle: {
		tableBorder: '1px solid #282828',
		tableBackgroundColor: '#141517',
		tableFontFamily:
			'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial,Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol,Noto Color Emoji',
		tableFontColor: '#6A7A89'
	},

	lightBodyStyle: {
		tableBorder: '1px solid #E2E2E2',
		tableBackgroundColor: '#F7F7F7',
		tableFontFamily:
			'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial,Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol,Noto Color Emoji',
		tableFontColor: 'red'
	},
	//#endregion

	//#region Header Style
	headerStyle: {
		tableHeaderColor: '#141517',
		tableHeaderFontColor: 'white',
		tableHeaderFontSize: '12px',
		tableHeaderFontWeight: 500,
		tableHeaderHeight: '36px'
	},

	lightHeaderStyle: {
		tableHeaderColor: '#F5F5F5',
		tableHeaderFontColor: 'white',
		tableHeaderFontSize: '1rem',
		tableHeaderFontWeight: 500,
		tableHeaderHeight: '36px'
	},
	//#endregion

	//#region Row Style
	rowStyle: {
		tableRowHeight: '35px',
		tableRowColor: '#141517',
		tableRowFontSize: '10px',
		tableRowFontWeight: 400,
		tableRowFontColor: 'white',
		tableRowBorderWidth: '1px',
		tableRowBorderColor: '#88888826',
		tableRowHoverColor: '#25272C',
		tableRowClickColor: '#3D3C4166'
	},

	lightRowStyle: {
		tableRowHeight: '35px',
		tableRowColor: '#ffffff',
		tableRowFontSize: '10px',
		tableRowFontWeight: 400,
		tableRowFontColor: 'black',
		tableRowBorderWidth: '1px',
		tableRowBorderColor: '#C6C4C4',
		tableRowHoverColor: '#EEF0FF',
		tableRowClickColor: '#E2E4FF'
	},
	//#endregion

	//#region Footer Style (Pagination)
	footerStyle: {
		// tableFooterColor: '#141517',
		tableFooterColor: '#162938',
		tableFooterHoverColor: 'white',
		tableFooterFontSize: '16px',
		tableFooterFontColor: '#8f8b8b',
		tableFooterFontWeight: 400,
		tableHoverBgColor: '#162938b6'
	},

	lightFooterStyle: {
		tableFooterColor: '#DCDDF8',
		tableFooterHoverColor: 'black',
		tableFooterFontSize: '16px',
		tableFooterFontColor: '#8F8B8B',
		tableFooterFontWeight: 400,
		tableHoverBgColor: '#D7D8FF'
	},
	//#endregion

	//#region Loader Style
	loaderStyle: {
		tableLoaderColor: '#999999',
		tableLoaderThichness: '5px',
		tableLoaderWidth: '48px',
		tableLoaderHeight: '48px',
		tableLoaderCycle: '1s'
	},
	//#endregion

	//#region Boolean Style
	booleanStyle: {
		booleanFontWeight: 600,
		trueFontColor: '#249d58',
		trueBackgroundColor: '#1d3831',
		falseFontColor: '#bc595c',
		falseBackgroundColor: '#4e2c37'
	},
	//#endregion

	//#region Number Style
	numberStyle: {
		tableRowNumberColor: '#204ff4'
	}
	//#endregion
};
//#endregion

//#region function
export function setColumnDefinition(
	...columnSetting: Partial<ColumnDefinition>[]
): ColumnDefinition[] {
	let columnDefinition: ColumnDefinition[] = [];
	columnSetting.forEach((item) => {
		columnDefinition.push({
			width: item.width,
			title: item.title || '',
			field: item.field || '',
			resizable: item.resizable || false,
			headerHozAlign: item.headerHozAlign || 'center',
			headerSort: item.headerSort,
			sorter: item.sorter || 'string',
			sorterParams: item.sorterParams || { alignEmptyValues: 'bottom' },
			hozAlign: item.hozAlign || 'center',
			vertAlign: item.vertAlign || 'middle',
			formatterParams: item.formatterParams || {},
			formatter: item.formatter || undefined,
			cellClick: item.cellClick || undefined,
			cellDblClick: item.cellDblClick || undefined,
			cellEdited: item.cellEdited || undefined,
			editable: item.editable || undefined,
			editor: item.editor || undefined,
			columns: item.columns || undefined,
			visible: item.visible || true
		});
	});
	return columnDefinition;
}

export const makeCustomElement = (
	elementInfo: { tag: string; textContent?: string; appendTo?: HTMLElement },
	...classList: string[]
) => {
	const { tag, textContent, appendTo } = elementInfo;
	const newElement = addClassList(
		createHTMLElement({
			tag,
			textContent,
			appendTo
		}),
		...classList
	);
	return newElement;
};

export const createHTMLElement = (props: {
	tag: string;
	textContent?: string;
	appendTo?: HTMLElement;
}): HTMLElement => {
	const { tag, textContent, appendTo } = props;
	let element = document.createElement(tag);
	if (textContent) {
		element.textContent = textContent;
	}
	if (appendTo) {
		appendTo.appendChild(element);
	}
	return element;
};

export const addClassList = (element: HTMLElement, ...classList: string[]): HTMLElement => {
	classList.forEach((className) => {
		element.classList.add(className);
	});
	return element;
};

export function subTableFormatter(
	cell: CellComponent,
	subTableColumnSetting: ColumnDefinition[],
	rowDblClickHandler?: (row: RowComponent) => Promise<void>
): HTMLElement {
	const cellElem = document.createElement('div');
	const toggleButton = document.createElement('div');

	// abnormals 가 없을 때는 그냥 리턴
	if (cell.getRow().getData().abnormals.length == 0) {
		toggleButton.classList.add('tabulator-empty-abnormal');
		cellElem.appendChild(toggleButton);
		cellElem.appendChild(document.createElement('span')).textContent = cell.getData().productNo;
		return cellElem;
	}

	toggleButton.classList.add('tabulator-data-tree-control');
	toggleButton.innerHTML = '<div class="tabulator-data-tree-control-expand"></div>';
	cellElem.appendChild(toggleButton);
	cellElem.appendChild(document.createElement('span')).textContent = cell.getData().productNo;

	toggleButton.addEventListener('click', function () {
		this.children[0].classList.toggle('tabulator-data-tree-control-expand');
		this.children[0].classList.toggle('tabulator-data-tree-control-collapse');

		const subtableHolder = this.closest('.tabulator-row')!.querySelector(
			'.subtable-holder'
		) as HTMLElement;

		if (subtableHolder) {
			subtableHolder.style.display = subtableHolder.style.display === 'none' ? 'block' : 'none';
		}

		const subTable = this.closest('.tabulator-row')!.querySelector('.subtable') as HTMLElement;
		subTable.style.maxHeight = '400px';
		if (subTable.classList.contains('tabulator')) {
			subTable.innerHTML = '';
			subTable.classList.remove('tabulator');
		} else {
			const tabulator = new Tabulator(subTable, {
				data: cell.getData().abnormals,
				columns: subTableColumnSetting,
				rowHeight: 29,
				layout: 'fitColumns'
			});
			tabulator.on('rowDblClick', async (_, row) => {
				if (rowDblClickHandler) await rowDblClickHandler(row);
			});
		}
	});

	return cellElem;
}

export function rowFormatter(row: RowComponent) {
	// let tableData = dataGrid.getData();
	// if (tableData[0].id === row.getData().id) {
	// 	firstRowComponent = row;
	// }
	// column 별로 style 적용
	row.getCells().forEach((cell) => {
		if (cell.getField() == 'endTime' || cell.getField() == 'startTime') {
			cell.getElement().style.fontSize = '0.85rem';
		}
	});
	if (!row.getData().endTime) {
		row.getCell('endTime').setValue('');
	}
	if (!row.getData().ct) {
		row.getCells().forEach((cell) => {
			cell.getElement().style.color = 'rgb(194 120 3)';
		});
	} else {
		row.getCells().forEach((cell, idx) => {
			if (idx < 2) {
				cell.getElement().style.color = 'rgb(23 106 246)';
			} else {
				cell.getElement().style.color = '#8b8b8b';
			}
		});
	}
}

export const makeStyle = (props: {
	isDarkMode: boolean;
	style?: ITableStyle;
	tableRowHeight?: string;
}) => {
	let { style, isDarkMode, tableRowHeight } = props;
	let tableStyle: Required<ITableStyle> = checkProps(style);
	let headerHeight = Number(tableStyle.headerStyle.tableHeaderHeight?.replace('px', ''));
	let tableBodyHeight = `calc(100% - ${(headerHeight ?? 36) + 45}px)`;
	return `
	--table-border:${isDarkMode ? tableStyle.bodyStyle.tableBorder : tableStyle.lightBodyStyle.tableBorder};
  --bg-color:${isDarkMode ? tableStyle.bodyStyle.tableBackgroundColor : tableStyle.lightBodyStyle.tableBackgroundColor};
  --font-family:${tableStyle.bodyStyle.tableFontFamily};
  --font-color:${tableStyle.bodyStyle.tableFontColor};

  --header-bg-color:${isDarkMode ? tableStyle.headerStyle.tableHeaderColor : tableStyle.lightHeaderStyle.tableHeaderColor};
	--header-font-color:${tableStyle.headerStyle.tableHeaderFontColor};
  --header-font-size:${tableStyle.headerStyle.tableHeaderFontSize};
  --header-font-weight:${tableStyle.headerStyle.tableHeaderFontWeight};
  --header-height:${tableStyle.headerStyle.tableHeaderHeight};
	--header-hover-color:${isDarkMode ? tableStyle.headerStyle.tableHeaderColor : tableStyle.lightHeaderStyle.tableHeaderColor};

  --row-bg-color:${isDarkMode ? tableStyle.rowStyle.tableRowColor : tableStyle.lightRowStyle.tableRowColor};
	--row-height:${tableRowHeight || tableStyle.rowStyle.tableRowHeight};
  --row-font-size:${tableStyle.rowStyle.tableRowFontSize};
  --row-font-weight:${tableStyle.rowStyle.tableRowFontWeight};
  --row-border-width:${tableStyle.rowStyle.tableRowBorderWidth};
  --row-border-color:${tableStyle.rowStyle.tableRowBorderColor};
  --row-number-color:${tableStyle.numberStyle.tableRowNumberColor};
  --row-font-color:${isDarkMode ? tableStyle.rowStyle.tableRowFontColor : tableStyle.lightRowStyle.tableRowFontColor};
	--row-hover-color:${isDarkMode ? tableStyle.rowStyle.tableRowHoverColor : tableStyle.lightRowStyle.tableRowHoverColor};
	--row-click-color:${isDarkMode ? tableStyle.rowStyle.tableRowClickColor : tableStyle.lightRowStyle.tableRowClickColor};

  --footer-bg-color:${isDarkMode ? tableStyle.footerStyle.tableFooterColor : tableStyle.lightFooterStyle.tableFooterColor};
  --footer-font-size:${tableStyle.footerStyle.tableFooterFontSize};
	--footer-font-color:${isDarkMode ? tableStyle.footerStyle.tableFooterFontColor : tableStyle.lightFooterStyle.tableFooterFontColor};
	--footer-font-active-color:${isDarkMode ? tableStyle.footerStyle.tableFooterHoverColor : tableStyle.lightFooterStyle.tableFooterHoverColor};
  --footer-font-weight:${tableStyle.footerStyle.tableFooterFontWeight};
	--footer-hover-font-color:${isDarkMode ? tableStyle.footerStyle.tableFooterHoverColor : tableStyle.lightFooterStyle.tableFooterHoverColor};
	--footer-hover-bg-color:${isDarkMode ? tableStyle.footerStyle.tableHoverBgColor : tableStyle.lightFooterStyle.tableHoverBgColor};

  --boolean-font-weight:${tableStyle.booleanStyle.booleanFontWeight};
  --true-font-color:${tableStyle.booleanStyle.trueFontColor};
  --true-bg-color:${tableStyle.booleanStyle.trueBackgroundColor};
  --false-font-color:${tableStyle.booleanStyle.falseFontColor};
  --false-bg-color:${tableStyle.booleanStyle.falseBackgroundColor};

  --loader-color:${tableStyle.loaderStyle.tableLoaderColor};
  --loader-thickness:${tableStyle.loaderStyle.tableLoaderThichness};
  --loader-width:${tableStyle.loaderStyle.tableLoaderWidth};
  --loader-height:${tableStyle.loaderStyle.tableLoaderHeight};
  --loader-cycle:${tableStyle.loaderStyle.tableLoaderCycle};

  --header-height:${tableStyle.headerStyle.tableHeaderHeight};
  --table-body-height:${tableBodyHeight};
`;
};

export function setStyle({ tableId, isDarkMode }: { tableId: string; isDarkMode: boolean }): void {
	const table = document.getElementById(tableId);

	if (isDarkMode) {
		table?.style.setProperty('--table-border', tableBasicStyle!.bodyStyle!.tableBorder!);
		table?.style.setProperty('--bg-color', tableBasicStyle!.bodyStyle!.tableBackgroundColor!);
		table?.style.setProperty('--header-bg-color', tableBasicStyle!.headerStyle!.tableHeaderColor!);
		table?.style.setProperty(
			'--header-hover-color',
			tableBasicStyle!.headerStyle!.tableHeaderColor!
		);
		table?.style.setProperty('--row-bg-color', tableBasicStyle!.rowStyle!.tableRowColor!);
		table?.style.setProperty('--row-font-color', tableBasicStyle!.rowStyle!.tableRowFontColor!);
		table?.style.setProperty('--row-hover-color', tableBasicStyle!.rowStyle!.tableRowHoverColor!);
		table?.style.setProperty('--row-click-color', tableBasicStyle!.rowStyle!.tableRowClickColor!);
		table?.style.setProperty('--footer-bg-color', tableBasicStyle!.footerStyle!.tableFooterColor!);
		table?.style.setProperty(
			'--footer-font-color',
			tableBasicStyle!.footerStyle!.tableFooterFontColor!
		);
		table?.style.setProperty(
			'--footer-font-active-color',
			tableBasicStyle!.footerStyle!.tableFooterHoverColor!
		);
		table?.style.setProperty(
			'--footer-hover-font-color',
			tableBasicStyle!.footerStyle!.tableFooterHoverColor!
		);
		table?.style.setProperty(
			'--footer-hover-bg-color',
			tableBasicStyle!.footerStyle!.tableHoverBgColor!
		);
	} else {
		table?.style.setProperty('--table-border', tableBasicStyle!.lightBodyStyle!.tableBorder!);
		table?.style.setProperty('--bg-color', tableBasicStyle!.lightBodyStyle!.tableBackgroundColor!);
		table?.style.setProperty(
			'--header-bg-color',
			tableBasicStyle!.lightHeaderStyle!.tableHeaderColor!
		);
		table?.style.setProperty(
			'--header-hover-color',
			tableBasicStyle!.lightHeaderStyle!.tableHeaderColor!
		);
		table?.style.setProperty('--row-bg-color', tableBasicStyle!.lightRowStyle!.tableRowColor!);
		table?.style.setProperty(
			'--row-font-color',
			tableBasicStyle!.lightRowStyle!.tableRowFontColor!
		);
		table?.style.setProperty(
			'--row-hover-color',
			tableBasicStyle!.lightRowStyle!.tableRowHoverColor!
		);
		table?.style.setProperty(
			'--row-click-color',
			tableBasicStyle!.lightRowStyle!.tableRowClickColor!
		);
		table?.style.setProperty(
			'--footer-bg-color',
			tableBasicStyle!.lightFooterStyle!.tableFooterColor!
		);
		table?.style.setProperty(
			'--footer-font-color',
			tableBasicStyle!.lightFooterStyle!.tableFooterFontColor!
		);
		table?.style.setProperty(
			'--footer-font-active-color',
			tableBasicStyle!.lightFooterStyle!.tableFooterHoverColor!
		);
		table?.style.setProperty(
			'--footer-hover-font-color',
			tableBasicStyle!.lightFooterStyle!.tableFooterHoverColor!
		);
		table?.style.setProperty(
			'--footer-hover-bg-color',
			tableBasicStyle!.lightFooterStyle!.tableHoverBgColor!
		);
	}
}

//#region function
const checkProps = (props?: ITableStyle): Required<ITableStyle> => {
	let style: Required<ITableStyle> = { ...tableBasicStyle };
	if (props) {
		Object.entries(props).forEach(([key, value]) => {
			if (key === 'bodyStyle') {
				style.bodyStyle = { ...tableBasicStyle.bodyStyle, ...value };
			} else if (key === 'headerStyle') {
				style.headerStyle = { ...tableBasicStyle.headerStyle, ...value };
			} else if (key === 'rowStyle') {
				style.rowStyle = { ...tableBasicStyle.rowStyle, ...value };
			} else if (key === 'footerStyle') {
				style.footerStyle = { ...tableBasicStyle.footerStyle, ...value };
			} else if (key === 'loaderStyle') {
				style.loaderStyle = { ...tableBasicStyle.loaderStyle, ...value };
			} else if (key === 'booleanStyle') {
				style.booleanStyle = { ...tableBasicStyle.booleanStyle, ...value };
			} else if (key === 'numberStyle') {
				style.numberStyle = { ...tableBasicStyle.numberStyle, ...value };
			}
		});
	}

	return style;
};

//#endregion
