import type { IGraphqlQueryOpts } from '$lib/common/graphql';

export const productsQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'products',
	operationName: 'products',
	selectFields: ['productNo', 'ct', 'startTime', 'endTime']
};

export const productHistoryQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'productHistory',
	operationName: 'productHistory',
	selectFields: [
		'productNo',
		'ct',
		'startTime',
		'endTime',
		'abnormals { productNo, abnormalCode, abnormalLevel, abnormalTool, abnormalBeginDate, abnormalValue, abnormalEndDate, abnormalDescription }'
	]
};

export const subscribeProductQueryOption: IGraphqlQueryOpts = {
	queryType: 'subscription',
	queryName: 'monitorProduct',
	operationName: 'monitorProduct',
	selectFields: [
		'productNo',
		'productBeginDate',
		'productEndDate',
		'productCt',
		'productResult',
		'productResultValue',
		'imageString',
		'productCount',
		'productAvgCt'
	]
};

export const productSumReportQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'productSumReports',
	operationName: 'productSumReports',
	selectFields: ['time', 'WorkshopCode', 'LineCode', 'OpCode', 'MachineCode', 'Count']
};
