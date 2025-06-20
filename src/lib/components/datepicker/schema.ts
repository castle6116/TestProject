export class CalendarStyle {
	style: string;
	buttonBackgroundColor: string;
	buttonBorderColor: string;
	buttonTextColor: string;
	buttonWidth: string;
	highlightColor: string;
	passiveHighlightColor: string;
	dayBackgroundColor: string;
	dayBackgroundColorIsNight: string;
	dayTextColor: string;
	dayTextColorIsNight: string;
	dayTextColorInRange: string;
	dayHighlightedBackgroundColor: string;
	dayHighlightedTextColor: string;
	currentDayTextColor: string;
	selectedDayTextColor: string;
	timeNightModeTextColor: string;
	timeNightModeBackgroundColor: string;
	timeDayModeTextColor: string;
	timeDayModeBackgroundColor: string;
	timeSelectedTextColor: string;
	timeInputTextColor: string;
	timeConfirmButtonColor: string;
	timeConfirmButtonTextColor: string;
	toolbarBorderColor: string;
	contentBackground: string;
	monthYearTextColor: string;
	legendTextColor: string;
	datepickerWidth: string;
	entireBoxSizing: string;
	buttonPadding: string;
	buttonBorder: string;
	buttonDisplay: string;
	buttonTextAlign: string;
	buttonTextDecoration: string;
	buttonCursor: string;
	buttonBorderRadius: string;
	buttonBoxShadow: string;
	contentMinWidth: string;
	contentWidth: string;
	contentDisplay: string;
	contentFlexDirection: string;
	datepickerDisplay: string;
	datepickerTextAlign: string;
	datepickerOverflow: string;
	viewDisplay: string;
	viewFlexDirection: string;
	viewAlignItems: string;
	veiwMediaMinWidth: string;
	viewMediaFlexDirection: string;
	viewMediaJustifyContent: string;
	constructor(overrides: { [key: string]: string } = {}) {
		this.style = "";

		this.entireBoxSizing = "inherit";

		this.buttonPadding = "10px 20px";
		this.buttonBorder = "1px solid #eee";
		this.buttonDisplay = "block";
		this.buttonTextAlign = "center";
		this.buttonWidth = "300px";
		this.buttonTextDecoration = "none";
		this.buttonCursor = "pointer";
		this.buttonBackgroundColor = "#262626";
		this.buttonTextColor = "white";
		this.buttonBorderRadius = "7px";
		this.buttonBoxShadow = "0px 0px 3px rgba(0, 0, 0, 0.1)";

		// 선택 구간 시작 날짜, 종료 날짜 반원 색
		this.highlightColor = "#f7901e";
		// 선택 구간 배경색
		this.passiveHighlightColor = "#FCD9B1";

		// 날짜 감싸는 원 색 (낮기간)
		this.dayBackgroundColor = "";
		// 날짜 감싸는 원 색 (저녁)
		this.dayBackgroundColorIsNight = "";
		this.dayTextColor = "white";
		this.dayTextColorIsNight = "white";
		// 날짜 선택 구간 Text Color
		// this.dayTextColorInRange = "#ADA7A7";
		this.dayTextColorInRange = "#989494";
		this.dayHighlightedBackgroundColor = "#efefef";
		// 날짜 Hover 시 Text Color
		this.dayHighlightedTextColor = "#958E8E";

		this.currentDayTextColor = "white";
		this.selectedDayTextColor = "white";

		this.timeNightModeTextColor = "white";
		// time 입력 창 배경색 (저녁 시간)
		this.timeNightModeBackgroundColor = "#262626";
		this.timeDayModeTextColor = "white";
		// time 입력 창 배경색 (낮 시간)
		this.timeDayModeBackgroundColor = "#262626";
		this.timeSelectedTextColor = "white";
		this.timeInputTextColor = "white";
		this.timeConfirmButtonColor = "#2196F3;";
		this.timeConfirmButtonTextColor = "white";

		this.toolbarBorderColor = "#888";

		this.contentMinWidth = "320px";
		this.contentWidth = "100%";
		this.contentDisplay = "flex";
		this.contentFlexDirection = "column";
		this.contentBackground = "#262626";

		// 달력 상단 월, 년 글자 색
		this.monthYearTextColor = "white";
		// 달력 요일 글자 색
		this.legendTextColor = "white";

		this.datepickerDisplay = "inline-block";
		this.datepickerTextAlign = "center";
		this.datepickerOverflow = "visible";
		this.datepickerWidth = "auto";

		this.viewDisplay = "flex";
		this.viewFlexDirection = "column";
		this.viewAlignItems = "center";

		this.veiwMediaMinWidth = "680px";
		this.viewMediaFlexDirection = "row";
		this.viewMediaJustifyContent = "center";

		Object.entries(overrides).forEach(([prop, value]) => {
			Object.assign(this, { [prop]: value });
		});
	}

	toWrapperStyle(): string {
		return `
		--button-padding: ${this.buttonPadding};
		--button-border: ${this.buttonBorder};
		--button-display: ${this.buttonDisplay};
		--button-text-align: ${this.buttonTextAlign};
		--button-width: ${this.buttonWidth};
		--button-text-decoration: ${this.buttonTextDecoration};
		--button-cursor: ${this.buttonCursor};
		--button-background-color: ${this.buttonBackgroundColor};
		--button-text-color: ${this.buttonTextColor};
		--button-border-radius: ${this.buttonBorderRadius};
		--button-box-shadow: ${this.buttonBoxShadow};
  
		--highlight-color: ${this.highlightColor};
		--passive-highlight-color: ${this.passiveHighlightColor};
  
		--entire-box-sizing: ${this.entireBoxSizing};
  
		--day-background-color: ${this.dayBackgroundColor};
		--day-background-color-is-night: ${this.dayBackgroundColorIsNight};
		--day-text-color: ${this.dayTextColor};
		--day-text-color-in-range: ${this.dayTextColorInRange};
		--day-text-color-is-night: ${this.dayTextColorIsNight};
		--day-highlighted-background-color: ${this.dayHighlightedBackgroundColor};
		--day-highlighted-text-color: ${this.dayHighlightedTextColor};
  
		--current-day-text-color: ${this.currentDayTextColor};
		--selected-day-text-color: ${this.selectedDayTextColor};
  
		--time-night-mode-text-color: ${this.timeNightModeTextColor};
		--time-night-mode-background-color: ${this.timeNightModeBackgroundColor};
		--time-day-mode-text-color: ${this.timeDayModeTextColor};
		--time-day-mode-background-color: ${this.timeDayModeBackgroundColor};
  
		--time-selected-text-color: ${this.timeSelectedTextColor};
		--time-input-text-color: ${this.timeInputTextColor};
		--time-confirm-button-text-color: ${this.timeConfirmButtonTextColor};
		--time-confirm-button-color: ${this.timeConfirmButtonColor};
  
		--toolbar-border-color: ${this.toolbarBorderColor};
  
		--content-min-width: ${this.contentMinWidth};
		--content-width: ${this.contentWidth};
		--content-display: ${this.contentDisplay};
		--content-flex-direction: ${this.contentFlexDirection};
		--content-background: ${this.contentBackground};
  
		--month-year-text-color: ${this.monthYearTextColor};
		--legend-text-color: ${this.legendTextColor};
  
		--datepicker-display: ${this.datepickerDisplay};
		--datepicker-text-align: ${this.datepickerTextAlign};
		--datepicker-overflow: ${this.datepickerOverflow};
		--datepicker-width: ${this.datepickerWidth};
  
		--view-display: ${this.viewDisplay};
		--view-flex-direction: ${this.viewFlexDirection};
		--view-align-items: ${this.viewAlignItems};
  
		--view-media-min-width: ${this.veiwMediaMinWidth};
		--view-media-flex-direction: ${this.viewMediaFlexDirection};
		--view-media-justify-content: ${this.viewMediaJustifyContent};

		${this.style}
	  `;
	}
}
