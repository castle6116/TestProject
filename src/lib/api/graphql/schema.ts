export interface IResponseData<T> extends Record<string, T> {
	response: T;
}

export interface IFilterCommonInput {
	workshopId: string;
	lineId: string;
	opCode: string;
}
