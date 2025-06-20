import graphqlHelper from '$lib/common/graphql';
import type { IFilterCommonInput } from '../schema';
import { monitorCncQueryOption } from './query';
import type { TMonitorCncResponse } from './schema';

// Cnc 모니터링 데이터 조회
export async function getMonitorCncData(filter: IFilterCommonInput): Promise<TMonitorCncResponse> {
	monitorCncQueryOption.arguments = {
		inputType: 'filterCommonInput',
		inputArgs: filter
	};

	let res = await graphqlHelper.request<TMonitorCncResponse>(monitorCncQueryOption);
	return res;
}
