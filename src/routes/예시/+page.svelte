<script lang="ts">
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { streamRawData } from '$lib/api/mqtt/raw';
	import { generateAbnormalData } from './dummyGrid';
	import {
		ABNORMAL_LOAD,
		PRODUCT_RESULT_NG,
		PRODUCT_RESULT_NG_DESC,
		PRODUCT_RESULT_OK_DESC
	} from '$constants/code';
	import { getAbnormalReportData } from '$lib/api/graphql/abnormal';
	import type {
		IAbnormalData,
		ISubscribeAbnormalData,
		TAbnormalReportResponse
	} from '$lib/api/graphql/abnormal/schema';
	import { getProductHistoryData, getProductSumReportData } from '$lib/api/graphql/product';
	import type {
		IProductHistoryData,
		ISubscribeProductData,
		TProductHistoryResponse,
		TProductSumReportResponse
	} from '$lib/api/graphql/product/schema';
	import type { IRawsData } from '$lib/api/mqtt/raw/schema';

	const rangeStart: string = dayjs().format('2024-07-17');
	const rangeEnd: string = dayjs().format('2024-07-18');
	const operationInfo = {
		workshopId: 'W001',
		lineId: 'L001',
		opCode: 'OP10-3'
	};

	let productHistoryDataRequest: TProductHistoryResponse | undefined = undefined;
	let getAbnormalReportDataRequest: TAbnormalReportResponse | undefined = undefined;
	let productSumReportDataRequest: TProductSumReportResponse | undefined = undefined;
	let recentPredict: number;
	let productHistory: IProductHistoryData[] | undefined = undefined;
	let toolStatusDescription: string;

	// Chart Data Source
	let chartTextData: IRawsData;
	let realtimeChartData: {
		time: number[];
		load: number[];
		predict: number[];
		loss: number[];
		productNo?: string;
	} = {
		time: [],
		load: [],
		predict: [],
		loss: []
	};

	let currentProductNo: string;

	let realtimeErrorTimer: NodeJS.Timeout;
	let abnormalErrorTimer: NodeJS.Timeout;
	let alarmTimeInfo: { startTime: string; endTime: string } | undefined = undefined;
	let isLoadingProductData: boolean = true;

	// 이상감지 이력
	$: IsAbnormalErrorEffect = false;
	// 실시간 가동 이상감지
	$: IsRealtimeErrorEffect = false;

	onMount(async () => {
		// 메인 대시보드 생산 정보 데이터 조회
		productHistoryDataRequest = await getProductHistoryData(
			{
				workshopId: 'W001',
				lineId: 'L001',
				opCode: 'OP10-3'
			},
			{
				rangeStart,
				rangeEnd
			}
		);

		productHistory = productHistoryDataRequest.response;
		console.log('productHistoryDataRequest', productHistoryDataRequest);

		// 이상 데이터 (PIE CHART) 조회
		getAbnormalReportDataRequest = await getAbnormalReportData({
			commonFilter: {
				workshopId: 'W001',
				lineId: 'L001',
				opCode: 'OP10-3'
			},
			rangeStart,
			rangeEnd
		});

		console.log('getAbnormalReportDataRequest', getAbnormalReportDataRequest);

		// 생산 통계 데이터 조회 (Bar Chart, 일별(1~24시)
		productSumReportDataRequest = await getProductSumReportData({
			commonFilter: operationInfo,
			periodType: 'Daily',
			rangeStart: rangeStart,
			rangeStop: rangeEnd
		});

		console.log('productSumReportDataRequest', productSumReportDataRequest);

		// 실시간 데이터 수집
		console.log('실시간 데이터 수집 시작');
		streamRawData((message) => {
			collectChartData(message);

			// 테스트용 GraphQL 이상감지 데이터 수신 (차트) 이벤트 콜백 등록
			randomRealTimeChartAbnormal(message);

			// 테스트용 GraphQL 이상감지 데이터 수신 (Grid) 이벤트 콜백 등록
			randomProductUpdate(message);
		});

		// 원본 코드의 알람 기능: GraphQL 이상감지 데이터 수신 (차트) 이벤트 콜백 등록
		// subscribeAbnormal(async (result) => {
		// 	// 데이터가 정상적으로 수신된 경우
		// 	if (result.data) {
		// 		logger.debug(`GraphQL Subscribe Data (subscribeAbnormal): ${JSON.stringify(result.data)}`);

		// 		let responseData = result.data.response;
		// 		updateAbnormalData(responseData);
		// 	}
		// 	// 데이터가 정상적으로 수신되지 않은 경우
		// 	else if (result.errors) {
		// 		throw new Error(result.errors[0].message);
		// 	}
		// });

		// 원본 코드의 알람 기능: GraphQL 데이터 수신 (Grid) 이벤트 콜백 등록
		// subscribeProduct(async (result) => {
		// 	// 데이터가 정상적으로 수신된 경우
		// 	if (result.data) {
		// 		logger.debug(`GraphQL Subscribe Data (subscribeAbnormal): ${JSON.stringify(result.data)}`);

		// 		updateProductData(result.data.response);
		// 	}
		// 	// 데이터가 정상적으로 수신되지 않은 경우
		// 	else if (result.errors) {
		// 		throw new Error(result.errors[0].message);
		// 	}
		// });
	});

	//#region Random Data Generation
	// 랜덤 이상 발생 함수
	function randomRealTimeChartAbnormal(message: IRawsData) {
		const randomValue = Math.random();
		if (randomValue < 0.01) {
			// 이상이 발생하지 않음
			toggleErrorEffect();

			alarmTimeInfo = {
				startTime: new Date(message.time / 1_000_000).toISOString(),
				endTime: new Date(message.time / 1_000_000 + 3000).toISOString()
			};
		}
	}

	// 랜덤 제품 업데이트 함수
	function randomProductUpdate(message: IRawsData) {
		const randomValue = Math.random();
		if (randomValue < 0.01) {
			// 제품 업데이트가 발생하지 않음
			toggleErrorEffect(true);

			const responseData: ISubscribeProductData = {
				productNo: `test-${dayjs().format('YYYYMMDD-HHmmss')}`,
				productBeginDate: new Date(message.time / 1_000_000).toISOString(),
				productEndDate: new Date(message.time / 1_000_000 + 3000).toISOString(),
				productCt: Number(Math.random().toFixed(2)),
				productResult: PRODUCT_RESULT_NG,
				productAvgCt: Number(Math.random().toFixed(2)),
				productCount: Math.floor(Math.random() * 100) + 1,
				productResultValue: Math.floor(Math.random() * 100) + 1,
				imageString: ''
			};

			updateProductData(responseData);
		}
	}
	//#endregion

	//#region Real-time Data Update Functions
	// 실시간 이상 감지 데이터 업데이트 함수
	function updateAbnormalData(responseData: ISubscribeAbnormalData) {
		if (responseData.abnormalCode == ABNORMAL_LOAD) {
			toggleErrorEffect(false);

			// 알람 시간 정보
			alarmTimeInfo = {
				startTime: responseData.abnormalBeginDate,
				endTime: responseData.abnormalEndDate
			};

			return;
		}

		// toolStatusDescription = responseData.abnormalDescription;
	}

	// 실시간 생산 이력 데이터 업데이트 함수
	async function updateProductData(responseData: ISubscribeProductData) {
		isLoadingProductData = true;
		const currentAbnormals: IAbnormalData[] = generateAbnormalData();
		const newProduct: IProductHistoryData = {
			productNo: responseData.productNo,
			startTime: responseData.productBeginDate,
			endTime: responseData.productEndDate,
			ct: responseData.productCt,
			abnormals:
				currentAbnormals.length == 0
					? []
					: [
							...currentAbnormals
								.filter((a) => a.abnormalCode == 'QUALITY')
								.sort((a, b) => {
									if (a.abnormalBeginDate > b.abnormalBeginDate) {
										return -1;
									}

									return 1;
								}),
							...currentAbnormals
								.filter((a) => a.abnormalCode != 'QUALITY')
								.sort((a, b) => {
									if (a.abnormalCode > b.abnormalCode) {
										return -1;
									}

									return 1;
								})
						]
		};

		currentProductNo = responseData.productNo;

		// 기존 productHistory에 추가
		productHistory = productHistory ? [newProduct, ...productHistory] : [newProduct];

		if (responseData.productResult == PRODUCT_RESULT_NG) {
			toggleErrorEffect(true);
			toolStatusDescription = PRODUCT_RESULT_NG_DESC;
		} else {
			toolStatusDescription = PRODUCT_RESULT_OK_DESC;
		}
		isLoadingProductData = false;
	}

	// 실시간 차트 데이터 수집
	function collectChartData(message: IRawsData) {
		// console.log(message);
		recentPredict = message.predict;

		realtimeChartData.time.push(message.time / 1_000_000_000 + 9 * 60 * 60);
		realtimeChartData.load.push(message.load);
		realtimeChartData.predict.push(message.predict);
		realtimeChartData.loss.push(message.loss);
		realtimeChartData.productNo = message.product_id as string;
		chartTextData = message;
	}
	//#endregion

	// 이상감지 효과 토글
	function toggleErrorEffect(isGrid: boolean = false) {
		if (isGrid) {
			IsAbnormalErrorEffect = true;
			if (abnormalErrorTimer) clearTimeout(abnormalErrorTimer);
			abnormalErrorTimer = setTimeout(() => {
				IsAbnormalErrorEffect = false;
			}, 3000);
		} else {
			IsRealtimeErrorEffect = true;
			if (realtimeErrorTimer) clearTimeout(realtimeErrorTimer);
			realtimeErrorTimer = setTimeout(() => {
				IsRealtimeErrorEffect = false;
			}, 3000);
		}
	}
</script>

<div class="flex h-full w-full items-center justify-center">API 확인 (F12-Console)</div>
