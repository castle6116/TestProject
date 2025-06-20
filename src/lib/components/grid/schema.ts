export interface ITableStyle {
	bodyStyle?: IBodyStyle;
	lightBodyStyle?: IBodyStyle;
	headerStyle?: IHeaderStyle;
	lightHeaderStyle?: IHeaderStyle;
	rowStyle?: IRowStyle;
	lightRowStyle?: IRowStyle;
	footerStyle?: IFooterStyle;
	lightFooterStyle?: IFooterStyle;
	loaderStyle?: ILoaderStyle;
	booleanStyle?: IBooleanStyle;
	numberStyle?: INumberStyle;
}

export interface IBodyStyle {
	tableBorder?: string;
	tableBackgroundColor?: string;
	tableFontFamily?: string;
	tableFontColor?: string;
}

export interface IHeaderStyle {
	tableHeaderColor?: string;
	tableHeaderFontColor?: string;
	tableHeaderFontSize?: string;
	tableHeaderFontWeight?: number;
	tableHeaderHeight?: string;
}

export interface IRowStyle {
	tableRowColor?: string;
	tableRowHeight?: string;
	tableRowFontSize?: string;
	tableRowFontWeight?: number;
	tableRowFontColor?: string;
	tableRowBorderWidth?: string;
	tableRowBorderColor?: string;
	tableRowHoverColor?: string;
	tableRowClickColor?: string;
}

export interface IFooterStyle {
	tableFooterColor?: string;
	tableFooterHoverColor?: string;
	tableFooterFontSize?: string;
	tableFooterFontWeight?: number;
	tableHoverBgColor?: string;
	tableFooterFontColor?: string;
}

export interface ILoaderStyle {
	tableLoaderColor?: string;
	tableLoaderThichness?: string;
	tableLoaderWidth?: string;
	tableLoaderHeight?: string;
	tableLoaderCycle?: string;
}

export interface IBooleanStyle {
	booleanFontWeight?: number;
	trueFontColor?: string;
	trueBackgroundColor?: string;
	falseFontColor?: string;
	falseBackgroundColor?: string;
}

export interface INumberStyle {
	tableRowNumberColor?: string;
}
