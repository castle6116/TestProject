import { setColumnDefinition } from "$lib/components/grid/grid";
import type { CellComponent } from "tabulator-tables";

export const aiFormatter = function (data: CellComponent) {
	if (data.getValue() <= 0) {
		// 정상
		return data.getValue();
	} else {
		// 이상
		return `<div class="px-1.5 border  test-sm rounded-sm text-[#6D2C25]  bg-[#FDE0E0] border-[#8D4368] dark:text-[#FF74B0]  dark:bg-[#492228] dark:border-[#683950]">${data.getValue()}</div>`;
	}
};

export const ctFormatter = function (data: CellComponent) {
	if (data.getData().abnormalCt == "Y") {
		// 정상
		return (data.getValue() / 10 ** 9).toFixed(2);
	} else if (data.getData().abnormalCt === "N") {
		// 이상
		return `<div class="px-1.5 border  test-sm rounded-sm text-[#6D2C25]  bg-[#FDE0E0] border-[#8D4368] dark:text-[#FF74B0]  dark:bg-[#492228] dark:border-[#683950]">${(data.getValue() / 10 ** 9).toFixed(2)}</div>`;
	}
	return "ERR";
};

export const loadFormatter = function (data: CellComponent) {
	if (data.getData().abnormalLoad == "Y") {
		// 정상
		return data.getValue().toFixed(0);
	} else if (data.getData().abnormalLoad === "N") {
		// 이상
		return `<div class="px-1.5 border  test-sm rounded-sm text-[#6D2C25]  bg-[#FDE0E0] border-[#8D4368] dark:text-[#FF74B0]  dark:bg-[#492228] dark:border-[#683950]">${data.getValue().toFixed(0)}</div>`;
	}
	return "ERR";
};

export const columnSetting = setColumnDefinition(
	{
		field: "productNo",
		title: "생산번호",
		width: 180,
	},
	{
		field: "abnormalAiValue",
		title: "AI",
		width: 80,
		formatter: aiFormatter,
	},
	{
		field: "abnormalCtValue",
		title: "CT",
		width: 120,
		formatter: ctFormatter,
	},
	{
		field: "abnormalLoadValue",
		title: "LOAD SUM",
		width: 120,
		formatter: loadFormatter,
	},
	{
		field: "abnormalBeginDate",
		title: "시작일시",
		width: 150,
	},
	{
		field: "abnormalEndDate",
		title: "종료일시",
		width: 150,
	},

	{
		field: "mainProgramNo",
		title: "Program No.",
		width: 150,
	},
	{
		field: "sov",
		title: "SOV",
	},
	{
		field: "fov",
		title: "FOV",
	},
	{
		field: "offsetX",
		title: "Offset X",
	},

	{
		field: "offsetZ",
		title: "Offset Z",
	},
);
