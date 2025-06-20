import type { IResponseData } from '$lib/api/graphql/schema';

export interface IFilterRawArgs {
	rangeStart: string;
	rangeStop: string;
	rangeStartString: string;
	aggregateInterval: string;
}

export interface IRawsData {
	[key: string]: string | number;
	time: number;
	feed: number;
	fov: number;
	load: number;
	loss: number;
	offset_x: number;
	offset_y: number;
	offset_z: number;
	predict: number;
	sov: number;
	interval: number;

	line_id: string;
	main_progm: string;
	mcode: string;
	op_code: string;
	status: string;
	sub_progm: string;
	tcode: string;
	work_id: string;
	product_id: string;
}

export type TRawsResponse = IResponseData<IRawsData>;
