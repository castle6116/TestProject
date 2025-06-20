import { DefaultPaletteProvider, EStrokePaletteMode, parseColorToUIntArgb } from "scichart";
import { hexToRGB } from "../../utils";

export class ColumnPaletteProvider extends DefaultPaletteProvider {
	private threshold: number | undefined;
	private stroke: number;
	private fillColor: number;
	private otherColor: number;

	constructor(threshold: number | undefined, originColor: string) {
		super();
		this.strokePaletteMode = EStrokePaletteMode.SOLID;
		this.threshold = threshold;
		this.stroke = parseColorToUIntArgb(originColor);
		this.fillColor = parseColorToUIntArgb(originColor);
		this.otherColor = parseColorToUIntArgb(hexToRGB(originColor, 0.4));
	}

	// This function is called for every data-point.
	// Return undefined to use the default color for the line,
	// else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
	override overrideStrokeArgb(
		xValue: number,
		_yValue: number,
		_index: number,
		_opacity: number,
		_metadata: any,
	) {
		// xValue 가 threshold 와 같은 경우, fillColor 로 변경
		return xValue == this.threshold
			? this.fillColor
			: // threshold 가 없으면, fillColor 로 변경
				this.threshold == undefined
				? this.fillColor
				: // xValue 가 threshold 와 다른 경우, otherColor 로 변경
					this.otherColor;
	}

	// This function is called for every data-point
	// Return undefined to use the default color for the fill, else, return
	// a custom color as ARGB color code e.g. 0xFFFF0000 is red
	override overrideFillArgb(
		xValue: number,
		_yValue: number,
		_index: number,
		_opacity: number,
		_metadata: any,
	) {
		// xValue 가 threshold 와 같은 경우, fillColor 로 변경
		return xValue == this.threshold
			? this.fillColor
			: // threshold 가 없으면, fillColor 로 변경
				this.threshold == undefined
				? this.fillColor
				: // xValue 가 threshold 와 다른 경우, otherColor 로 변경
					this.otherColor;
	}
}
