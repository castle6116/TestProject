import type { IGraphqlQueryOpts } from '$lib/common/graphql';

export const getAbnormalQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'abnormals',
	operationName: 'abnormals',
	selectFields: [
		'pageCount',
		'abnormals { productNo, abnormalCode, abnormalLevel, abnormalBeginDate, abnormalEndDate, abnormalTool, abnormalValue, abnormalDescription, mainProgramNo, subProgramNo, sov, fov, offsetX, offsetY, offsetZ }'
	]
};

export const getAbnormalReportQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'abnormalReports',
	operationName: 'abnormalReport',
	selectFields: ['abnormalCode', 'abnormalCount', 'abnormalTool']
};

export const subscribeAbnormalQueryOption: IGraphqlQueryOpts = {
	queryType: 'subscription',
	queryName: 'monitorAbnormal',
	operationName: 'monitorAbnormal',
	selectFields: [
		'abnormalCode',
		'abnormalLevel',
		'abnormalBeginDate',
		'abnormalEndDate',
		'abnormalTool',
		'abnormalValue',
		'abnormalDescription'
	]
};

// export const subscribeAbnormalQueryOption: IGraphqlQueryOpts = {
// 	queryType: 'subscription',
// 	queryName: 'monitorAbnormal',
// 	operationName: 'monitorAbnormal',
// 	selectFields: [
// 		'productNo',
// 		'productCount',
// 		'productAvgCt',
// 		'productResult',
// 		'productResultValue',
// 		'imageString',
// 		'productBeginDate',
// 		'productEndDate',
// 		'productCt',
// 		'toolCount { toolCode, toolCount }',
// 		'productAbnormal { productNo, abnormalCode, abnormalBeginDate, abnormalEndDate, abnormalTool, abnormalValue, abnormalDescription }'
// 	]
// };
