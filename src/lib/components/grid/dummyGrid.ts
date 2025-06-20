import type { IAbnormalData } from '$lib/api/graphql/abnormal/schema';

// 랜덤 문자열 생성
const randomString = (length: number) =>
	Math.random()
		.toString(36)
		.substring(2, 2 + length)
		.toUpperCase();

// 날짜 포맷 (오늘 기준 ± 일수)
const randomDate = (daysOffset: number = 0) =>
	new Date(Date.now() + daysOffset * 86400000).toISOString();

// 더미 데이터 생성 함수
export function generateAbnormalData(): IAbnormalData[] {
	const count = Math.floor(Math.random() * 3) + 3; // 3~5개
	const levels = ['LOW', 'MEDIUM', 'HIGH'];
	const tools = ['CAMERA', 'SENSOR', 'LASER'];
	const abnormalCode = ['부하', '공구', '품질'];

	return Array.from({ length: count }, () => ({
		abnormalBeginDate: randomDate(-Math.floor(Math.random() * 5)),
		abnormalEndDate: randomDate(),
		abnormalCode: abnormalCode[Math.floor(Math.random() * abnormalCode.length)],
		abnormalLevel: levels[Math.floor(Math.random() * levels.length)],
		abnormalDescription: `오차율 ${+(Math.random() * 100).toFixed(2)}%`,
		abnormalTool: tools[Math.floor(Math.random() * tools.length)],
		abnormalValue: Number(Math.random().toFixed(2)),
		feed: +(Math.random() * 10).toFixed(2),
		fov: +(Math.random() * 100).toFixed(2),
		imageString: `data:image/png;base64,${randomString(20)}`,
		mCode: `M${randomString(3)}`,
		mainProgramNo: `MP-${randomString(3)}`,
		offsetX: +(Math.random() * 50).toFixed(2),
		offsetY: +(Math.random() * 50).toFixed(2),
		offsetZ: +(Math.random() * 50).toFixed(2),
		productNo: `P-${randomString(4)}`,
		sov: +(Math.random() * 10).toFixed(2),
		subProgramNo: `SP-${randomString(3)}`,
		tCode: `T-${randomString(4)}`
	}));
}
