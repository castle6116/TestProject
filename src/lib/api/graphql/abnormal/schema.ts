import type { IFilterCommonInput, IResponseData } from '../schema';

//#region Query & Mutation
export interface IFilterAbnormalArgs {
	commonFilter: IFilterCommonInput;
	rangeStart?: string;
	rangeEnd?: string;
	productNo?: string;
	abnormalCode?: string;
	filterKeyword?: string;
	sortInput?: IFilterAbnormalSort;
	count?: number;
	page?: number;
}

export interface IFilterAbnormalSort {
	sortColumn: string;
	sortDirection: string;
}

export interface IFilterAbnormalReportArgs {
	commonFilter: IFilterCommonInput;
	rangeStart: string;
	rangeEnd: string;
}

export interface IAbnormalData {
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

export interface IAbnormalReportData {
	abnormalCode: string;
	abnormalCount: number;
	abnormalTool: string;
}

export interface IAbnormalHistoryData {
	pageCount: number;
	abnormals: IAbnormalData[];
}
//#endregion

//#region Subscription
export interface ISubscribeAbnormalData {
	abnormalCode: string;
	abnormalLevel: string;
	abnormalDescription: string;
	abnormalBeginDate: string;
	abnormalEndDate: string;
	abnormalTool: string;
	abnormalValue: string;
}

export interface IProductAbnormalData {
	productNo: string;
	abnormalCode: string;
	abnormalLevel: string;
	abnormalDescription: string;
	abnormalBeginDate: string;
	abnormalEndDate: string;
	abnormalTool: string;
	abnormalValue: string;
}

interface IToolCountData {
	toolCode: string;
	toolCount: number;
}
//#endregion

export type TSubscribeAbnormalResponse = IResponseData<ISubscribeAbnormalData>;
export type TAbnormalResponse = IResponseData<IAbnormalHistoryData>;
export type TAbnormalReportResponse = IResponseData<IAbnormalReportData[]>;
