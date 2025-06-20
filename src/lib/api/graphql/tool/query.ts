import type { IGraphqlQueryOpts } from '$lib/common/graphql';

export const createToolChangeQueryOption: IGraphqlQueryOpts = {
	queryType: 'mutation',
	queryName: 'createToolChange',
	operationName: 'createToolChange',
	selectFields: ['toolCode', 'reasonCode', 'toolUseCount', 'changeDate']
};

// Tool Info Query Option 추가
export const getToolInfoQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'toolInfo',
	operationName: 'toolInfo',
	selectFields: [
		'workshopId',
		'lineId',
		'opCode',
		'toolCode',
		'toolName',
		'createAt',
		'updateAt',
		'warnRate',
		'maxCount',
		'no'
	]
};

// Tool Operation Info Query Option 추가
export const getToolOperationInfoQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'opInfo',
	operationName: 'getToolOperationInfo',
	selectFields: ['lineId', 'opCode', 'workshopId']
};

// Create Tool Info Query Option 추가
export const createToolInfoQueryOption: IGraphqlQueryOpts = {
	queryType: 'mutation',
	queryName: 'createToolInfo',
	operationName: 'createToolInfo',
	selectFields: ['isSuccess']
};

// Update Tool Info Query Option 추가
export const updateToolInfoQueryOption: IGraphqlQueryOpts = {
	queryType: 'mutation',
	queryName: 'updateToolInfo',
	operationName: 'updateToolInfo',
	selectFields: ['isSuccess']
};

// Delete Tool Info Query Option 추가
export const deleteToolInfoQueryOption: IGraphqlQueryOpts = {
	queryType: 'mutation',
	queryName: 'deleteToolInfo',
	operationName: 'deleteToolInfo',
	selectFields: ['isSuccess']
};

// import 제거 후, 아래와 같이 변경
export const subscribeToolCountQueryOption: IGraphqlQueryOpts = {
	queryType: 'subscription',
	queryName: 'monitorToolCount',
	operationName: 'monitorToolCount',
	selectFields: ['code', 'useCount', 'toolStatusCount', 'isUpdateTool', 'useStartTime']
};

export const subscribeToolStatusQueryOption: IGraphqlQueryOpts = {
	queryType: 'subscription',
	queryName: 'monitorToolStatus',
	operationName: 'monitorToolStatus',
	selectFields: ['code', 'toolStatus', 'toolStatusValue']
};

// 공구 교체 및 사용 이력
export const toolChangeInfoQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'toolChangeLastReports',
	operationName: 'toolChangeLastReports',
	selectFields: ['toolCode', 'reasonCode', 'changeDate', 'toolUseCount', 'toolUseCountAvg']
};

export const CreateToolChangeInputOption: IGraphqlQueryOpts = {
	queryType: 'mutation',
	queryName: 'createToolChange',
	operationName: 'createToolChange',
	selectFields: ['changeDate', 'isSuccess', 'reasonCode', 'toolCode', 'toolUseCount']
};

// 공구 교체 평균 사용 횟수
export const ToolAvgReportQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'toolChangeAverageReports',
	operationName: 'toolChangeAverageReports',
	selectFields: ['changeCount', 'toolCode', 'toolUseCountAvg']
};

// 공구 교체 평균 사용 횟수(6개월)

export const ToolAvgReportSumQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'toolChangeSumReports',
	operationName: 'toolChangeSumReports',
	selectFields: ['reportDate', 'toolUseCount{toolCode,toolUseCountSum}']
};
