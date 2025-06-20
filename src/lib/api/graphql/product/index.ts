import dayjs from 'dayjs';
import graphqlHelper from '$lib/common/graphql';
import {
	productHistoryQueryOption,
	productsQueryOption,
	productSumReportQueryOption,
	subscribeProductQueryOption
} from './query';
import type {
	IFilterProductArgs,
	IProductSumReportArgs,
	IProductSumReportData,
	TProductHistoryResponse,
	TProductsResponse,
	TProductSumReportResponse,
	TSubscribeProductResponse
} from './schema';
import type { ExecutionResult } from 'graphql';
import type { IFilterCommonInput } from '../schema';

// Product 데이터 조회
export async function getProducts(): Promise<TProductsResponse> {
	productsQueryOption.arguments = {
		inputType: 'filterProductInput',
		inputArgs: {
			rangeStart: dayjs().format('YYYY-MM-DD'),
			rangeEnd: dayjs().add(1, 'day').format('YYYY-MM-DD')
		}
	};
	let res = await graphqlHelper.request<TProductsResponse>(productsQueryOption);
	return res;
}

// 생산 이력 데이터 조회
export async function getProductHistoryData(
	filter: IFilterCommonInput,
	args?: IFilterProductArgs
): Promise<TProductHistoryResponse> {
	productHistoryQueryOption.arguments = {
		inputType: 'filterProductInput',
		inputArgs: {
			commonFilter: filter,
			// rangeStart: dayjs().format('YYYY-MM-DD'),
			// rangeEnd: dayjs().add(1, 'day').format('YYYY-MM-DD'),
			...args
		}
	};
	let res = await graphqlHelper.request<TProductHistoryResponse>(productHistoryQueryOption);
	return res;
}

export async function subscribeProduct(
	callback: (result: ExecutionResult<TSubscribeProductResponse, unknown>) => void
) {
	graphqlHelper.subscribe(subscribeProductQueryOption, callback);
}

export function getProductSumReportData(
	args: IProductSumReportArgs,
	signal?: AbortSignal
): Promise<TProductSumReportResponse> {
	productSumReportQueryOption.arguments = {
		inputType: 'filterProductSumReportInput',
		inputArgs: args
	};

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(generateProductSumReportData());
		}, 1000);
	});
	// return graphqlHelper.request<TProductSumReportResponse>(productSumReportQueryOption, signal);
}

//#region Product Sum Report Data Generation
// 유틸 함수: 날짜 객체를 ISO 문자열로 변환
function formatISODate(date: Date): string {
	return date.toISOString();
}

// 유틸 함수: 랜덤 코드 생성
function randomCode(prefix: string): string {
	return `${prefix}-${Math.floor(Math.random() * 100 + 1)}`;
}

// 메인 함수: 5월 1일부터 5월 31일까지의 더미 데이터 생성
export function generateProductSumReportData(): TProductSumReportResponse {
	const data: IProductSumReportData[] = [];
	const year = 2025;
	const month = 4; // JS 기준 0-indexed → 4는 5월

	for (let time = 1; time <= 24; time++) {
		const date = new Date(Date.UTC(year, month, time));
		data.push({
			time: formatISODate(date),
			WorkshopCode: randomCode('WS'),
			LineCode: randomCode('LN'),
			OpCode: randomCode('OP'),
			Count: Math.floor(Math.random() * 1000) + 1
		});
	}
	return {
		response: data
	};
}
//#endregion
