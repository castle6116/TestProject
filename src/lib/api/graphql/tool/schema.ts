import type { IResponseData } from '../schema';

// CreateToolChange 변수 타입
export interface ICreateToolChangeArgs {
	toolCode: string;
	reasonCode: string;
}

// CreateToolInfo 변수 타입
export interface ICreateToolInfoArgs {
	lineId: string;
	opCode: string;
	toolCode: string;
	toolName: string;
	workshopId: string;
	maxCount: number;
	warnRate: number;
	no: number;
}

// UpdateToolInfo 변수 타입
export interface IUpdateToolInfoFilterArgs {
	lineId: string;
	opCode: string;
	toolCode?: string;
	workshopId: string;
}
export interface IUpdateToolInfoArgs {
	toolName: string;
	maxCount: number;
	warnRate: number;
	no: number;
}

// DeleteToolInfo 변수 타입
export interface IDeleteToolInfoArgs {
	lineId: string;
	opCode: string;
	toolCode: string;
	workshopId: string;
}

// GetToolInfo 변수 타입
export interface IGetToolInfoArgs {
	lineId: string;
	opCode: string;
	toolCode?: string;
	workshopId: string;
}

// ToolCount Data Type
export interface IToolCountData {
	code: string;
	useCount: number;
	toolStatusCount: string;
	isUpdateTool: boolean;
	useStartTime: number;
}

// CreateToolChange Data Type
export interface ICreateToolChangeData {
	toolCode: string;
	reasonCode: string;
	changeDate: string;
	toolUseCount: number;
}

export interface IToolInfoCrudData {
	isSuccess: boolean;
}

// Get Tool Info Data Type
export interface IGetToolInfoData {
	workshopId: string;
	lineId: string;
	opCode: string;
	toolCode: string;
	toolName: string;
	createAt: string;
	updateAt: string;
	// Grid에 넣을 때에는 string, graphql에 넣을 때에는 number
	warnRate: number | string;
	maxCount: number | string;
	no: number | string;
}

// Get Tool Operation Info Data Type
export interface IGetToolOperationInfoData {
	lineId: string;
	opCode: string;
	workshopId: string;
}

export interface IToolStatusData {
	code: string;
	toolStatus: string;
	toolStatusValue: number;
}

// 공구교체 사용이력
export interface IToolInfoData {
	changeDate: string;
	toolCode: string;
	toolUseCount: string;
	toolUseCountAvg: string;
	reasonCode: string;
}

export interface IToolChangeArgs {
	workshopId: string;
	lineId: string;
	opCode: string;
	toolCode: string;
	reasonCode: string;
}

export interface IToolChangeData {
	changeDate: Date;
	isSuccess: boolean;
	reasonCode: string;
	toolCode: string;
	toolUseCount: number;
}

// 공구교체 평균 사용횟수
export interface IGetToolAvgReportData {
	changeCount: number;
	toolCode: string;
	toolUseCountAvg: number;
}

// 공구교체 평균 사용횟수 (6개월)
export interface ToolChangeSumOutput {
	toolCode: string;
	toolUseCountSum: number;
}

export interface ToolChangeSumReportData {
	reportDate: string;
	toolUseCount: ToolChangeSumOutput[];
}

export interface FilterToolReportInput {
	beginMonth: number;
	beginYear: number;
	endMonth: number;
	endYear: number;
}

export type TToolCountResponse = IResponseData<IToolCountData[]>;
export type TCreateToolChangeResponse = IResponseData<ICreateToolChangeData>;
export type TGetToolInfoResponse = IResponseData<IGetToolInfoData[]>;
export type TGetToolOperationInfoResponse = IResponseData<IGetToolOperationInfoData[]>;
export type TToolInfoCrudResponse = IResponseData<IToolInfoCrudData>;
export type TToolStatusResponse = IResponseData<IToolStatusData>;
export type TToolInfoResponse = IResponseData<IToolInfoData[]>;
export type TToolChangeResponse = IResponseData<IToolChangeData>;
export type TToolAvgReportResponse = IResponseData<IGetToolAvgReportData[]>;
export type IToolAvgReportSumResponse = IResponseData<ToolChangeSumReportData[]>;
