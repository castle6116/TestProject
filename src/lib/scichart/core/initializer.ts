import {
	Thickness,
	libraryVersion,
	EAutoColorMode,
	SciChartSurface,
	SciChartDefaults,
} from "scichart";
import { scichart2022Theme, CustomChartLoader } from "../visuals/theme/theme";
import {
	PUBLIC_SCICHART_DATA_FILE_PATH,
	PUBLIC_SCICHART_LICENSE_KEY,
	PUBLIC_SCICHART_WASM_FILE_PATH,
} from "$env/static/public";
import type { IInitChartParams, IChartCommonParams, IChartSurface } from "./type";
import { initChartAxis } from "../axes/axis";

export async function initializeChart(
	params: IInitChartParams,
	isOffline: boolean = false,
): Promise<IChartCommonParams> {
	configureChart(isOffline);

	const scichartCommonParams: IChartCommonParams = await createChartSurface({
		...params.chartSurfaceParam,
	});

	const { sciChartSurface, wasmContext } = scichartCommonParams;
	sciChartSurface.autoColorMode = EAutoColorMode.Always;

	initChartAxis({
		sciChart: scichartCommonParams,
		xAxisParams: params.xAxisParam,
		yAxisParams: params.yAxisParam,
	});

	return { sciChartSurface, wasmContext };
}

export function configureChart(isOffline: boolean = false) {
	// SciChart 라이센스키 설정
	SciChartSurface.setRuntimeLicenseKey(PUBLIC_SCICHART_LICENSE_KEY);

	// Scichart 메모리 자동 정리  설정
	SciChartSurface.autoDisposeWasmContext = true;
	SciChartSurface.wasmContextDisposeTimeout = 100;

	// WebGL 버퍼 사이즈 설정
	SciChartDefaults.wasmBufferSizesKb = 1024;

	// SciChart Data & Wasm URL 설정
	let dataUrl: string = "";
	let wasmUrl: string = "";
	// online 일 경우, CDN URL 사용
	if (!isOffline) {
		dataUrl = `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart2d.data`;
		wasmUrl = `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart2d.wasm`;
	}

	// offline 일 경우, local path 사용
	if (isOffline) {
		dataUrl = `${PUBLIC_SCICHART_DATA_FILE_PATH}`;
		wasmUrl = `${PUBLIC_SCICHART_WASM_FILE_PATH}`;
	}

	SciChartSurface.configure({
		dataUrl,
		wasmUrl,
	});
}

// create Chart Surface -> Init Axis -> Init Data Series -> Init Renderable Series -> Add Renderable Series
export async function createChartSurface(params: IChartSurface): Promise<IChartCommonParams> {
	const { sciChartSurface, wasmContext } = await SciChartSurface.create(params.chartName, {
		theme: {
			...scichart2022Theme.SciChartJsTheme,
			sciChartBackground: params.background,
			majorGridLineBrush: "transparent",
			minorGridLineBrush: "transparent",
			loadingAnimationForeground: "green",
			legendBackgroundBrush: "null",
		},
		loader: new CustomChartLoader(),
		padding: (params.padding as Thickness) || new Thickness(4, 0, 2, -2),
		drawSeriesBehindAxis: params.isDrawBehind,
		disableAspect: true,
	});
	return { sciChartSurface, wasmContext };
}
