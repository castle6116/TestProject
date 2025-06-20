import type { IGraphqlQueryOpts } from '$lib/common/graphql';

export const monitorCncQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'monitorCnc',
	operationName: 'monitorCnc',
	selectFields: [
		'operationTime',
		'parameter { workshopId,lineId,opCode,status,mainProgramNo,subProgramNo,sov,fov,offsetX,offsetY,offsetZ }',
		'product { productNo,productCount,productAvgCt,productResultValue,imageString, productAbnormal { abnormalDescription } }',
		'toolStatus {toolCode, toolStatusAi, toolStatusAiValue, useCount, maxCount, toolStatusCount}'
	]
};
