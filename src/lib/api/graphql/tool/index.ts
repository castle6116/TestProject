import graphqlHelper from '$lib/common/graphql';
import type { ExecutionResult } from 'graphql';
import {
	createToolChangeQueryOption,
	createToolInfoQueryOption,
	deleteToolInfoQueryOption,
	getToolInfoQueryOption,
	getToolOperationInfoQueryOption,
	subscribeToolCountQueryOption,
	subscribeToolStatusQueryOption,
	updateToolInfoQueryOption,
	toolChangeInfoQueryOption,
	CreateToolChangeInputOption,
	ToolAvgReportQueryOption,
	ToolAvgReportSumQueryOption
} from './query';
import type {
	ICreateToolChangeArgs,
	ICreateToolInfoArgs,
	IDeleteToolInfoArgs,
	IGetToolInfoArgs,
	IUpdateToolInfoArgs,
	IUpdateToolInfoFilterArgs,
	TCreateToolChangeResponse,
	TGetToolInfoResponse,
	TGetToolOperationInfoResponse,
	TToolCountResponse,
	TToolInfoCrudResponse,
	TToolStatusResponse,
	TToolInfoResponse,
	IToolChangeArgs,
	TToolChangeResponse,
	TToolAvgReportResponse,
	IToolAvgReportSumResponse,
	FilterToolReportInput
} from './schema';
import type { IFilterCommonInput } from '../schema';

// 툴 교체
export async function createToolChange(
	args: ICreateToolChangeArgs
): Promise<TCreateToolChangeResponse> {
	createToolChangeQueryOption.arguments = {
		inputType: 'createToolInput',
		inputArgs: {
			...args
		}
	};
	let res = await graphqlHelper.request<TCreateToolChangeResponse>(createToolChangeQueryOption);
	return res;
}

// 툴 정보 생성
export async function createToolInfo(args: ICreateToolInfoArgs): Promise<TToolInfoCrudResponse> {
	createToolInfoQueryOption.arguments = {
		inputType: 'createToolInfoInput',
		inputArgs: {
			...args
		}
	};
	let res = await graphqlHelper.request<TToolInfoCrudResponse>(createToolInfoQueryOption);
	return res;
}

// 툴 정보 수정
export async function updateToolInfo({
	filterArgs,
	toolInfoArgs
}: {
	filterArgs: IUpdateToolInfoFilterArgs;
	toolInfoArgs: IUpdateToolInfoArgs;
}): Promise<TToolInfoCrudResponse> {
	updateToolInfoQueryOption.arguments = {
		inputType: ['filterToolInfoInput', 'updateToolInfoInput'],
		inputArgs: [{ ...filterArgs }, { ...toolInfoArgs }]
	};
	let res = await graphqlHelper.request<TToolInfoCrudResponse>(updateToolInfoQueryOption);
	return res;
}

// 툴 정보 삭제
export async function deleteToolInfo(args: IDeleteToolInfoArgs): Promise<TToolInfoCrudResponse> {
	deleteToolInfoQueryOption.arguments = {
		inputType: 'filterToolInfoInput',
		inputArgs: {
			...args
		}
	};
	let res = await graphqlHelper.request<TToolInfoCrudResponse>(deleteToolInfoQueryOption);
	return res;
}

// export async

// 툴 정보 조회
export async function getToolInfo(args: IGetToolInfoArgs): Promise<TGetToolInfoResponse> {
	getToolInfoQueryOption.arguments = {
		inputType: 'filterToolInfoInput',
		inputArgs: {
			...args
		}
	};
	let res = await graphqlHelper.request<TGetToolInfoResponse>(getToolInfoQueryOption);
	return res;
}

// 툴 Operation 정보 조회
export async function getToolOperationInfo(): Promise<TGetToolOperationInfoResponse> {
	let res = await graphqlHelper.request<TGetToolOperationInfoResponse>(
		getToolOperationInfoQueryOption
	);
	return res;
}

// 툴 카운트 Subscribe
export async function subscribeToolCount(
	callback: (result: ExecutionResult<TToolCountResponse, unknown>) => void
) {
	graphqlHelper.subscribe(subscribeToolCountQueryOption, callback);
}

// 공구 이상감지 Subscribe
export async function subscribeToolStatus(
	callback: (result: ExecutionResult<TToolStatusResponse, unknown>) => void
) {
	graphqlHelper.subscribe(subscribeToolStatusQueryOption, callback);
}

// 공구 교체 및 사용 이력
export async function ToolChangeInfo(filter: IFilterCommonInput): Promise<TToolInfoResponse> {
	toolChangeInfoQueryOption.arguments = {
		inputType: 'filterCommonInput',
		inputArgs: filter
	};

	let res = await graphqlHelper.request<TToolInfoResponse>(toolChangeInfoQueryOption);
	return res;
}

export async function updateToolChangeInfo(args: IToolChangeArgs): Promise<TToolChangeResponse> {
	CreateToolChangeInputOption.arguments = {
		inputType: 'createToolInput',
		inputArgs: {
			...args
		}
	};
	let res = await graphqlHelper.request<TToolChangeResponse>(CreateToolChangeInputOption);
	return res;
}

// 공구교체 평균 사용 횟수
export async function getToolChangeAvgReport(
	filter: IFilterCommonInput
): Promise<TToolAvgReportResponse> {
	ToolAvgReportQueryOption.arguments = {
		inputType: 'filterCommonInput',
		inputArgs: filter
	};

	let res = await graphqlHelper.request<TToolAvgReportResponse>(ToolAvgReportQueryOption);
	return res;
}

// 공구교체 평균 사용 횟수(6개월)
export async function getToolChangeAvgSumReport(
	args: FilterToolReportInput
): Promise<IToolAvgReportSumResponse> {
	ToolAvgReportSumQueryOption.arguments = {
		inputType: 'filterToolReportInput',
		inputArgs: {
			...args
		}
	};
	let res = await graphqlHelper.request<IToolAvgReportSumResponse>(ToolAvgReportSumQueryOption);
	return res;
}
