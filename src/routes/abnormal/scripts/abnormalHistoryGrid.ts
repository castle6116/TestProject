import { setColumnDefinition } from '$lib/components/grid/grid';
import { abnormalCodeFormatter, abnormalDescriptionFormatter } from '../../monitoring/scripts/mainMonitoringGrid';


export const columnSetting = setColumnDefinition(
	{
		field: 'productNo',
		title: '생산번호',
		width: 180
	},
	{
		field: 'abnormalCode',
		title: '이상감지 구분',
		width: 120,
		formatter: abnormalCodeFormatter
	},
	{
		field: 'abnormalBeginDate',
		title: '시작일시',
		width: 150
	},
	{
		field: 'abnormalEndDate',
		title: '종료일시',
		width: 150
	},
	{
		field: 'abnormalDescription',
		title: '예측결과',
		width: 200,
		formatter: abnormalDescriptionFormatter
	},
	{
		field: 'mainProgramNo',
		title: 'Main Prog No.',
		width: 150
	},
	{
		field: 'subProgramNo',
		title: 'Sub prog No.',
		width: 150
	},
	{
		field: 'sov',
		title: 'SOV'
	},
	{
		field: 'fov',
		title: 'FOV'
	},
	{
		field: 'offsetX',
		title: 'Offset X'
	},
	{
		field: 'offsetY',
		title: 'Offset Y'
	},
	{
		field: 'offsetZ',
		title: 'Offset Z'
	}
);
