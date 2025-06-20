import type { IFilterCommonInput, IResponseData } from '../schema';

export interface IFilterProductArgs {
	productNo?: string;
	rangeStart?: string;
	rangeEnd?: string;
	count?: number;
}
export interface IProductSumReportArgs {
	commonFilter: IFilterCommonInput;
	periodType: string;
	rangeStart?: string;
	rangeStop?: string;
}

export interface IProductsData {
	count: number;
	ct: number;
	startTime: string;
	endTime: string;
	productNo: string;
	feed: number;
	fov: number;
	mCode: string;
	mainProgramNo: string;
	offsetX: number;
	offsetY: number;
	offsetZ: number;
	sov: number;
	subProgramNo: string;
	status: number;
	tCode: string;
	updateAt: string;
}

export interface IProductHistoryData {
	abnormals: IAbnormalData[];
	ct: number;
	endTime: string;
	startTime: string;
	productNo: string;
	result?: string;
}

interface IAbnormalData {
	abnormalBeginDate: string;
	abnormalCode: string;
	abnormalLevel: string;
	abnormalDescription: string;
	abnormalEndDate: string;
	abnormalTool: string;
	abnormalValue: number;
	feed: number;
	fov: number;
	imageString: string;
	mCode: string;
	mainProgramNo: string;
	offsetX: number;
	offsetY: number;
	offsetZ: number;
	productNo: string;
	sov: number;
	subProgramNo: string;
	tCode: string;
}

export interface ISubscribeProductData {
	productNo: string;
	productCount: number;
	productCt: number;
	productAvgCt: number;
	productResultValue: number;
	productResult: string;
	productBeginDate: string;
	productEndDate: string;
	imageString: string;
}

export interface IProductSumReportData {
	time: string;
	WorkshopCode: string;
	LineCode: string;
	OpCode: string;
	Count: number;
}

export type TProductsResponse = IResponseData<IProductsData[]>;
export type TProductHistoryResponse = IResponseData<IProductHistoryData[]>;
export type TSubscribeProductResponse = IResponseData<ISubscribeProductData>;
export type TProductSumReportResponse = IResponseData<IProductSumReportData[]>;
