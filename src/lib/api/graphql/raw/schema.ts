import type { IFilterCommonInput, IResponseData } from '../schema';

export interface IFilterRawArgs {
	// 최근 이력 조회 시에는 rangeStartString , aggregateInterval 필요
	// 특정 기간 조회 시에는 rangeStart, rangeStop 필요
	commonFilter: IFilterCommonInput;
	rangeStartString?: string;
	aggregateInterval?: string;
	rangeStart?: string;
	rangeStop?: string;
}

export interface IGqlRawsData {
	[key: string]: string | number;
	feed: number;
	fov: number;
	lineId: string;
	load: number;
	loss: number;
	mCode: string;
	mainProgramNo: string;
	offsetX: number;
	offsetY: number;
	offsetZ: number;
	opCode: string;
	predict: number;
	sov: number;
	status: string;
	subProgramNo: string;
	tCode: string;
	time: string;
	workshopId: string;
}

export type TRawsResponse = IResponseData<IGqlRawsData[]>;
