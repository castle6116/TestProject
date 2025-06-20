import type { IGraphqlQueryOpts } from '$lib/common/graphql';

export const rawsQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'raws',
	operationName: 'raws',
	selectFields: ['workshopId', 'lineId', 'opCode', 'time', 'load', 'predict', 'loss']
};
