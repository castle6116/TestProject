import type {
	IColumnChartStyle,
	IStackedColumnChartStyle
} from '$lib/scichart/chartTypes/column/type';
import type { ILineChartStyle } from '$lib/scichart/chartTypes/line/type';
import { AUTO_COLOR } from 'scichart';

//#region Line Chart Style
// 최근이력 실제부하
// lightgreen
export const loadLineStyle: ILineChartStyle = {
	strokeColor: '#666666',
	thickness: 2
};

// ff33ff
// 최근이력 예측부하
export const predictLineStyle: ILineChartStyle = {
	strokeColor: '#ff99ff',
	thickness: 1.2,
	strokeDashArray: [2, 3]
};

// 오차율
export const lossLineStyle: IColumnChartStyle = {
	strokeColor: '#90EE90',
	strokeLightColor: AUTO_COLOR,
	thickness: 0.1,
	barWidth: 0.3
};

export const colorArray = [
	'#FF5733',
	'#33FF57',
	'#3357FF',
	'#FF33B5',
	'#FFC300',
	'#DAF7A6',
	'#900C3F',
	'#581845',
	'#3498DB',
	'#1ABC9C',
	'#9B59B6',
	'#F1C40F',
	'#E74C3C',
	'#2ECC71',
	'#34495E',
	'#16A085',
	'#2980B9',
	'#8E44AD',
	'#D35400',
	'#C0392B',
	'#BDC3C7',
	'#7F8C8D',
	'#27AE60',
	'#2980B9',
	'#6C3483',
	'#85C1E9',
	'#82E0AA',
	'#F7DC6F',
	'#F1948A',
	'#E74C3C',
	'#2E4053',
	'#58D68D',
	'#5DADE2',
	'#AF7AC5',
	'#F8C471',
	'#A569BD',
	'#73C6B6',
	'#D98880',
	'#99A3A4',
	'#5D6D7E',
	'#ABB2B9',
	'#AAB7B8',
	'#D5DBDB',
	'#2980B9',
	'#76D7C4',
	'#F0B27A',
	'#7FB3D5',
	'#B7950B',
	'#CA6F1E',
	'#6E2C00'
];

//#endregion

//#region Stacked Column Chart Style
export const stackedColumnStyle: IStackedColumnChartStyle = {
	strokeColor: ['red', 'green', 'blue'],
	thickness: 1.5,
	barWidth: 0.4
};
//#endregion
