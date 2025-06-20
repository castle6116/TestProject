import graphqlHelper from '$lib/common/graphql';
import { rawsQueryOption } from './query';
import type { IFilterRawArgs, TRawsResponse } from './schema';

// Chart 데이터 조회
export async function getChartData(args: IFilterRawArgs): Promise<TRawsResponse> {
	rawsQueryOption.arguments = {
		inputType: 'filterRawInput',
		inputArgs: {
			...args
		}
	};
	let res = await graphqlHelper.request<TRawsResponse>(rawsQueryOption);
	return res;
}
