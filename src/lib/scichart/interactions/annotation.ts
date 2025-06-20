import {
	Thickness,
	BoxAnnotation,
	LineAnnotation,
	TextAnnotation,
	SciChartSurface,
	ECoordinateMode,
	CustomAnnotation,
	EVerticalAnchorPoint,
	EHorizontalAnchorPoint,
} from "scichart";

export function addWarningAnnotation({
	chartSurface,
	id,
	x1,
	x2,
}: {
	chartSurface: SciChartSurface;
	id: string;
	x1: number;
	x2: number;
}) {
	const boxHighAnnotation = new BoxAnnotation({
		x1: x1,
		x2: x2,
		y1: 0,
		y2: 2,
		fill: "red",
		opacity: 0.1,
		strokeThickness: 1,
		yCoordinateMode: ECoordinateMode.Relative,
		xCoordinateMode: ECoordinateMode.DataValue,
		id,
	});
	chartSurface.annotations.add(boxHighAnnotation);
}

export function addTextAnnotation({
	chartSurface,
	id,
	x1,
	x2,
	y1,
	y2,
	fontColor,
	text,
	fontSize,
	fontWeight,
	coordinateMode = "Value",
	backgroundColor,
	padding,
	opacity,
	yAxisId,
}: {
	chartSurface: SciChartSurface;
	id: string;
	x1: number;
	y1: number;
	x2?: number;
	y2?: number;
	text: string;
	fontColor?: string;
	fontWeight?: string;
	fontSize?: number;
	coordinateMode?: "Value" | "Relative";
	backgroundColor?: string;
	padding?: [number, number, number, number];
	opacity?: number;
	yAxisId?: string;
}) {
	chartSurface.annotations.add(
		new TextAnnotation({
			x1,
			x2,
			y1,
			y2,
			textColor: fontColor,
			text,
			id,
			yAxisId,
			fontSize: fontSize || 12,
			fontWeight: fontWeight || "Regular",
			background: backgroundColor,
			opacity: opacity || 1,
			padding: padding ? new Thickness(...padding!) : undefined,
			xCoordinateMode:
				coordinateMode == "Value" ? ECoordinateMode.DataValue : ECoordinateMode.Relative,
			yCoordinateMode:
				coordinateMode == "Value" ? ECoordinateMode.DataValue : ECoordinateMode.Relative,
		}),
	);
}

export function addArrowDownAnnotation({
	chartSurface,
	id,
	x1,
	y1,
	baseColor,
	direction,
}: {
	chartSurface: SciChartSurface;
	id: string;
	x1: number;
	y1: number;
	baseColor: string;
	direction: "left" | "right";
}) {
	const LEFT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20px" height="20px" viewBox="0 0 453.000000 340.000000" preserveAspectRatio="xMidYMid meet">
<g transform="translate(0.000000,340.000000) scale(0.100000,-0.100000)" fill="white" stroke="none">
<path d="M1336 3151 l-99 -100 251 -258 c138 -142 413 -420 611 -618 l361 -360 0 -555 0 -555 -170 170 -170 170 -100 -100 -100 -100 347 -347 348 -348 88 88 c49 48 201 203 339 345 l251 258 -99 100 -99 99 -172 -172 -173 -173 -1 615 0 615 -657 663 -657 663 -99 -100z"/>
</g>
</svg>`;
	const RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20px" height="20px" viewBox="0 0 453.000000 340.000000">
<g transform="translate(0.000000,340.000000) scale(0.100000,-0.100000)" fill="white" stroke="none">
<path d="M2437 2586 l-657 -664 0 -614 0 -613 -173 173 -172 172 -99 -99 -99 -100 251 -258 c138 -142 290 -297 339 -345 l88 -88 348 348 347 347 -100 100 -100 100 -170 -170 -170 -170 0 555 0 555 361 360 c198 198 473 476 611 618 l252 258 -100 100 -100 99 -657 -664z"/>
</g>
</svg>`;

	// let baseSize = 20;
	let svgString: string = "";
	if (direction == "left") {
		svgString = LEFT_SVG;
	} else {
		svgString = RIGHT_SVG;
	}

	chartSurface.annotations.add(
		new CustomAnnotation({
			x1,
			y1,
			verticalAnchorPoint: EVerticalAnchorPoint.Top,
			horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
			id,
			svgString,
		}),
	);
}

export function addWarningIconAnnotation({
	chartSurface,
	id,
	x1,
	y1,
}: {
	chartSurface: SciChartSurface;
	id: string;
	x1: number;
	y1: number;
}) {
	chartSurface.annotations.add(
		new CustomAnnotation({
			x1: x1 - 2.3,
			y1,
			verticalAnchorPoint: EVerticalAnchorPoint.Top,
			horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
			id,
			svgString: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 122.89 111.55">
      <path fill="#b71616" d="M2.35,84.43L45.29,10.2l.17-.27h0a22.92,22.92,0,0,1,7-7.23A17,17,0,0,1,61.58,0a16.78,16.78,0,0,1,9.11,2.69,22.79,22.79,0,0,1,7,7.26c.13.21.25.42.36.64l42.24,73.34.23.44h0a22.22,22.22,0,0,1,2.37,10.19,17.59,17.59,0,0,1-2.16,8.35,16,16,0,0,1-6.94,6.61l-.58.26a21.34,21.34,0,0,1-9.11,1.74v0H17.62c-.23,0-.44,0-.66,0a18.07,18.07,0,0,1-6.2-1.15A16.46,16.46,0,0,1,3,104.26a17.59,17.59,0,0,1-3-9.58,23,23,0,0,1,1.57-8.74,8.24,8.24,0,0,1,.77-1.51Z"/>
      <path fill="#e21b1b" d="M9,88.76L52.15,14.16c5.23-8.25,13.53-8.46,18.87,0l42.44,73.7c3.38,6.81,1.7,16-9.34,15.77H17.62c-7.27.18-12-6.19-8.64-14.87Z"/>
      <path fill="#fff" d="M57.57,82.7a5.51,5.51,0,0,1,3.48-1.58,5.75,5.75,0,0,1,2.4.35,5.82,5.82,0,0,1,2,1.31,5.53,5.53,0,0,1,1.62,3.55,6.05,6.05,0,0,1-.08,1.4,5.54,5.54,0,0,1-5.64,4.6,5.67,5.67,0,0,1-2.27-.52,5.56,5.56,0,0,1-2.82-2.94,5.65,5.65,0,0,1-.35-1.27,5.83,5.83,0,0,1-.06-1.31h0a6.19,6.19,0,0,1,.57-2,4.57,4.57,0,0,1,1.13-1.56Zm8.16-10.24c-.2,4.79-8.31,4.8-8.5,0-.82-8.21-2.92-29.39-2.85-37.1.07-2.38,2-3.79,4.56-4.33a12.83,12.83,0,0,1,5,0c2.61.56,4.65,2,4.65,4.44v.24L65.73,72.46Z"/>
    </svg>`,
		}),
	);
}

export function addLineAnnotation({
	chartSurface,
	id,
	x1,
	x2,
	y1,
	y2,
	strokeColor,
	thickness,
}: {
	chartSurface: SciChartSurface;
	id: string;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	strokeColor: string;
	thickness?: number;
}) {
	chartSurface.annotations.add(
		new LineAnnotation({
			xCoordinateMode: ECoordinateMode.DataValue,
			yCoordinateMode: ECoordinateMode.DataValue,
			x1,
			x2,
			y1,
			y2,
			id,
			stroke: strokeColor,
			strokeDashArray: [3, 2],
			strokeThickness: thickness ?? 1,
		}),
	);
}

export function addBoxAnnotation({
	chartSurface,
	id,
	x1,
	x2,
	y1,
	y2,
	strokeColor,
	strokeThickness,
	backgroundColor,
	opacity,
	coordinateMode = "DataValue",
}: {
	chartSurface: SciChartSurface;
	id: string;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	strokeColor: string;
	strokeThickness?: number;
	backgroundColor: string;
	opacity?: number;
	coordinateMode?: "DataValue" | "Relative";
}) {
	chartSurface.annotations.add(
		new BoxAnnotation({
			x1,
			x2,
			y1,
			y2,
			id,
			stroke: strokeColor,
			strokeThickness: strokeThickness || 1,
			fill: backgroundColor,
			opacity: opacity || 1,
			xCoordinateMode: ECoordinateMode[coordinateMode],
			yCoordinateMode: ECoordinateMode[coordinateMode],
		}),
	);
}
