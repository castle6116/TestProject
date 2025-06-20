import { setColumnDefinition, subTableFormatter } from '$lib/components/grid/grid';
import type { CellComponent, ColumnDefinition } from 'tabulator-tables';
import {
	ABNORMAL_LOAD,
	ABNORMAL_LOAD_DESC,
	ABNORMAL_QUALITY,
	ABNORMAL_QUALITY_DESC,
	ABNORMAL_TOOL,
	ABNORMAL_TOOL_DESC,
	PRODUCT_RESULT_NG_DESC,
	PRODUCT_RESULT_OK_DESC,
	PRODUCT_RESULT_WARN_DESC
} from '../../../constants/code';
import { isDarkMode } from '../../../dashboard/provider/store';

let isDarkModeLocal = true;

isDarkMode.subscribe((value) => {
	isDarkModeLocal = value;
});

export const resultFormatter = function (data: CellComponent) {
	if (data.getValue() == PRODUCT_RESULT_OK_DESC) {
		// 양품
		return `<div class="px-1.5 border border-[#4F6E3B] test-sm bg-[#DAFBF2] rounded-sm text-[#236D34] dark:bg-[#22373B] dark:text-[#77D2CD] dark:border-[#396A6C]">${PRODUCT_RESULT_OK_DESC}</div>`;
	} else if (data.getValue() === PRODUCT_RESULT_NG_DESC) {
		// 불량
		return `<div class="px-1.5 border  test-sm rounded-sm text-[#6D2C25]  bg-[#FDE0E0] border-[#8D4368] dark:text-[#FF74B0]  dark:bg-[#492228] dark:border-[#683950]">${PRODUCT_RESULT_NG_DESC}</div>`;
	} else if (data.getValue() === PRODUCT_RESULT_WARN_DESC) {
		// 경고
		return `<div class="px-1.5 border  test-sm rounded-sm text-[#704F2A]  bg-[#F7EBD5] border-[#C07509] dark:text-[#FBBB3D]  dark:bg-[#423D34] dark:border-[#7B694F]">${PRODUCT_RESULT_WARN_DESC}</div>`;
	}
	return '';
};

export const abnormalCodeFormatter = function (data: CellComponent) {
	if ((data.getValue() as string).toUpperCase() == ABNORMAL_LOAD_DESC) {
		// 부하
		return `<div class="w-11 border  test-sm rounded-sm text-[#666031] dark:text-[#FBBB3D] bg-[#F9FCD6] dark:bg-[#423D34]  border-[#7B694F]">${ABNORMAL_LOAD_DESC}</div>`;
	} else if ((data.getValue() as string).toUpperCase() == ABNORMAL_TOOL_DESC) {
		// 공구
		return `<div class="w-11 border  test-sm rounded-sm text-[#704F2A]  bg-[#F7EBD5] border-[#C07509] dark:text-[#FFA50E]  dark:bg-[#351F00] dark:border-[#B46C06]">${ABNORMAL_TOOL_DESC}</div>`;
	} else if ((data.getValue() as string).toUpperCase() == ABNORMAL_QUALITY_DESC) {
		// 품질
		return `<div class="w-11 border  test-sm rounded-sm text-[#6D2C25]  bg-[#FDE0E0] border-[#8D4368] dark:text-[#FF74B0]  dark:bg-[#492228] dark:border-[#683950]">${ABNORMAL_QUALITY_DESC}</div>`;
	}
	return '';
};

export const abnormalDescriptionFormatter = function (data: CellComponent) {
	if ((data.getValue() as string).includes('T')) {
		return (
			// 한계 수명 초과
			`${isDarkModeLocal ? "<span style='color:#FFA50E'>" : "<span style='color:#D67100'>"}` +
			(data.getValue() as string).replace('부하', '마모') +
			'</span>'
		);
	} else if ((data.getValue() as string).includes(PRODUCT_RESULT_NG_DESC)) {
		// 불량
		return (
			`${isDarkModeLocal ? "<span style='color:#FF74B0'>" : "<span style='color:#E5240F'>"}` +
			data.getValue() +
			'</span>'
		);
	} else {
		// 오차율
		return (
			`${isDarkModeLocal ? "<span style='color:#FDCF8D'>" : "<span style='color:#A69C26'>"}` +
			data.getValue() +
			'</span>'
		);
	}
};

export const columnSetting: ColumnDefinition[] = setColumnDefinition(
	{
		field: 'productNo',
		title: '생산번호',
		width: 140,
		formatter: (cell: CellComponent) => subTableFormatter(cell, abnormalSubTableColumnSetting)
	},
	{
		field: 'startTime',
		title: '시작일시'
	},
	{
		field: 'endTime',
		title: '종료일시'
	},
	{
		field: 'result',
		title: '검사결과',
		width: 90,
		formatter: resultFormatter
	},
	{
		field: 'ct',
		title: 'C/T(초)',
		width: 90
	}
);

export const abnormalSubTableColumnSetting: ColumnDefinition[] = setColumnDefinition(
	{
		title: '구분',
		field: 'abnormalCode',
		resizable: false,
		headerSort: false,
		formatter: abnormalCodeFormatter,
		width: 100
	},
	{
		title: '발생시각',
		field: 'abnormalBeginDate',
		resizable: false,
		headerSort: false
	},
	{
		title: '종료일시',
		field: 'abnormalEndDate',
		resizable: false,
		headerSort: false
	},
	{
		title: '예측결과',
		field: 'abnormalDescription',
		resizable: false,
		headerSort: false,
		formatter: abnormalDescriptionFormatter
	}
);
