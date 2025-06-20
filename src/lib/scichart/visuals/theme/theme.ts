import { type ISciChartLoader, type ICursorModifierOptions, parseColorToUIntArgb } from "scichart";
import type { IThemeProvider } from "scichart/Charting/Themes/IThemeProvider";
import { SciChartJsNavyTheme } from "scichart/Charting/Themes/SciChartJsNavyTheme";

export interface AppThemeBase {
	SciChartJsTheme: IThemeProvider;

	// general colors
	ForegroundColor: string;
	Background: string;

	// Series colors
	VividSkyBlue: string;
	VividPink: string;
	VividTeal: string;
	VividOrange: string;
	VividBlue: string;
	VividPurple: string;
	VividGreen: string;
	VividRed: string;

	MutedSkyBlue: string;
	MutedPink: string;
	MutedTeal: string;
	MutedOrange: string;
	MutedBlue: string;
	MutedPurple: string;
	MutedRed: string;

	PaleSkyBlue: string;
	PalePink: string;
	PaleTeal: string;
	PaleOrange: string;
	PaleBlue: string;
	PalePurple: string;
}

export class SciChart2022AppTheme implements AppThemeBase {
	SciChartJsTheme = new SciChartJsNavyTheme();

	// General colors
	ForegroundColor = "#FFFFFF";
	Background = this.SciChartJsTheme.sciChartBackground;

	// Series colors
	VividSkyBlue = "#50C7E0";
	VividPink = "#EC0F6C";
	VividTeal = "#30BC9A";
	VividOrange = "#F48420";
	VividBlue = "#364BA0";
	VividPurple = "#882B91";
	VividGreen = "#67BDAF";
	VividRed = "#C52E60";

	DarkIndigo = "#14233C";
	Indigo = "#264B93";

	MutedSkyBlue = "#83D2F5";
	MutedPink = "#DF69A8";
	MutedTeal = "#7BCAAB";
	MutedOrange = "#E7C565";
	MutedBlue = "#537ABD";
	MutedPurple = "#A16DAE";
	MutedRed = "#DC7969";

	PaleSkyBlue = "#E4F5FC";
	PalePink = "#EEB3D2";
	PaleTeal = "#B9E0D4";
	PaleOrange = "#F1CFB5";
	PaleBlue = "#B5BEDF";
	PalePurple = "#CFB4D5";
}

export const scichart2022Theme = new SciChart2022AppTheme();

export class CustomChartLoader implements ISciChartLoader {
	public type: "Custom";
	public loadingText: string = "loading..";
	constructor(options?: { loadingText?: string }) {
		this.loadingText = options?.loadingText ?? this.loadingText;
	}
	public addChartLoader(domChartRoot: HTMLDivElement, theme: IThemeProvider): HTMLElement {
		const loaderContainerDiv = document.createElement("div");
		loaderContainerDiv.style.margin = "auto";
		loaderContainerDiv.style.backgroundColor = "white";
		loaderContainerDiv.style.maxHeight = "100%";
		loaderContainerDiv.style.height = "100%";
		loaderContainerDiv.style.width = "100%";
		loaderContainerDiv.style.display = "flex";
		loaderContainerDiv.style.justifyContent = "center";
		loaderContainerDiv.style.alignItems = "center";

		// image 부분
		// const loaderImage = document.createElement("img") as HTMLImageElement;
		// loaderImage.src = "https://i.giphy.com/media/2WjpfxAI5MvC9Nl8U7/giphy.webp";
		// loaderImage.style.width = "100%";
		// loaderImage.style.height = "100%";
		// loaderContainerDiv.appendChild(loaderImage);

		// text 부분
		const loaderText = document.createElement("div");
		loaderText.style.float = "left";
		loaderText.style.textAlign = "center";
		loaderText.style.position = "absolute";
		loaderText.innerHTML = this.loadingText;
		loaderText.style.color = "#1E2123";
		loaderText.style.fontFamily = "Arial";
		loaderText.style.fontSize = "8px";
		loaderContainerDiv.appendChild(loaderText);
		domChartRoot.appendChild(loaderContainerDiv);
		// if (domChartRoot.id === "AI0_0_div") {
		// domChartRoot.style.display = "flex";
		// }
		return loaderContainerDiv;
	}
	public removeChartLoader(domChartRoot: HTMLDivElement, loaderElement: HTMLElement): void {
		// Remove loader after 2000ms timeout
		// setTimeout(() => domChartRoot.removeChild(loaderElement), 200000);
		domChartRoot.removeChild(loaderElement);
		// For instant removal once scichart has loaded, just call domChartRoot.removeChild(loaderElement) without the setTimeout
		// e.g.
		// domChartRoot.removeChild(loaderElement);
	}
}

//#region Common Color
export const THRESHOLD_HIGH_COLOR = parseColorToUIntArgb(scichart2022Theme.VividPink);

export const CHART_BACKGROUND_LIGHT_COLOR = "#ffffff";
export const CHART_BACKGROUND_DARK_COLOR = "#191919";

export const CHART_BACKGROUND_COLOR = "#191919";

export const AXIS_MINOR_LINE_COLOR = "#191919";
export const AXIS_MAJOR_LINE_COLOR = "#191919";
export const DETAIL_CHART_BACKGROUND_COLOR = "#121416";
export const DETAIL_CHART_MINOR_LINE_COLOR = "white";
export const DETAIL_CHART_MAJOR_LINE_COLOR = "white";
export const STATISTICS_BACKGROUND_COLOR = "#0C0C0E";
export const TOOLPAD_CHART_COLOR_SET = [
	"#2B5F78",
	"#233B64",
	"#2F7999",
	"#2C627B",
	"#243C66",
	"#1A4893",
	"#247A65",
];
export const PRODUCTION_CHART_COLOR_SET = ["#2B5F78", "#247A65"];
export const OPERATION_CHART_COLOR_SET = ["#758082", "#184595", "#A78E2B"];
export const HW_ALARM_CHART_COLOR_SET = ["#89090C", "#AB5302", "#A99029"];
export const TOOLPAD_STATISTICS_COLOR_SET = [
	"#758082",
	"#184595",
	"#A78E2B",
	"#89090C",
	"#AB5302",
	"#247A65",
];
//#endregion

// #region Mouse Cursor Style
export const cursorModifierOpts: ICursorModifierOptions = {
	crosshairStroke: "#ff6600",
	crosshairStrokeThickness: 1,
	tooltipContainerBackground: "#000000",
	tooltipTextStroke: "white",
	showTooltip: true,
	tooltipShadow: "rgba(0, 0, 0, 0)",
};
// #endregion
