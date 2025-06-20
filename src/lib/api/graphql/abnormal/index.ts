import graphqlHelper from '$lib/common/graphql';
import type { ExecutionResult } from 'graphql';
import {
	getAbnormalQueryOption,
	getAbnormalReportQueryOption,
	subscribeAbnormalQueryOption
} from './query';
import type {
	IFilterAbnormalArgs,
	IFilterAbnormalReportArgs,
	TAbnormalReportResponse,
	TAbnormalResponse,
	TSubscribeAbnormalResponse
} from './schema';

// Abnormal Data 조회
export async function getAbnormalData(args: IFilterAbnormalArgs): Promise<TAbnormalResponse> {
	getAbnormalQueryOption.arguments = {
		inputType: 'filterAbnoramlInput',
		inputArgs: { ...args }
	};

	let res = await graphqlHelper.request<TAbnormalResponse>(getAbnormalQueryOption);
	return res;
}

export function getAbnormalQuery(args: IFilterAbnormalArgs) {
	getAbnormalQueryOption.arguments = {
		inputType: 'filterAbnoramlInput',
		inputArgs: { ...args }
	};

	return graphqlHelper.makeQueryString(getAbnormalQueryOption);
}

export async function getAbnormalReportData(
	args: IFilterAbnormalReportArgs
): Promise<TAbnormalReportResponse> {
	getAbnormalReportQueryOption.arguments = {
		inputType: 'filterAbnoramlInput',
		inputArgs: { ...args }
	};
	let res = await graphqlHelper.request<TAbnormalReportResponse>(getAbnormalReportQueryOption);
	return res;
}

// 실시간 이상 감지
export async function subscribeAbnormal(
	callback: (result: ExecutionResult<TSubscribeAbnormalResponse, unknown>) => void
) {
	graphqlHelper.subscribe(subscribeAbnormalQueryOption, callback);
}
