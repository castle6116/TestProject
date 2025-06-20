import type { IGqlRawsData } from '../raw/schema';
import type { IResponseData } from '../schema';

export interface IMonitorCncData {
	operationTime: string;
	parameter: IGqlRawsData;
	product: IProductData;
	toolStatus: IToolStatusData[];
}

export interface IProductData {
	productCount: number;
	productAvgCt: number;
	productNo: string;
	productResultValue: number;
	imageString: string;
	toolCount: IToolCountData[];
	productAbnormal: IProductAbnormalData;
}

interface IProductAbnormalData {
	abnormalDescription: string;
}

interface IToolCountData {
	toolCode: string;
	toolCount: number;
}

interface IToolStatusData {
	toolCode: string;
	toolStatusAi: string;
	toolStatusAiValue: number;
	useCount: number;
	maxCount: number;
	toolStatusCount: string;
}

export type TMonitorCncResponse = IResponseData<IMonitorCncData>;
