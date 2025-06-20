import dayjs from "dayjs";

export function makeDateTime(stringDate: string, addZero?: boolean) {
	let date = new Date(stringDate);
	let year = date.getFullYear();
	let month: number | string = date.getMonth() + 1;
	let day: number | string = date.getDate();
	let hour: number | string = date.getHours();
	let min: number | string = date.getMinutes();
	let sec: number | string = date.getSeconds();
	let msec: number | string = date.getMilliseconds();

	if (addZero) {
		month = addNumberZero(month);
		day = addNumberZero(day);
		hour = addNumberZero(hour);
		min = addNumberZero(min);
		sec = addNumberZero(sec);
		msec = addNumberZero(msec, true);

		return { year, month, day, hour, min, sec, msec };
	} else {
		return { year, month, day, hour, min, sec, msec };
	}
}

export function makeDateString(stringDate: string, addZero?: boolean, toString?: boolean) {
	try {
		const { year, month, day } = makeDateTime(stringDate, addZero);
		if (toString) {
			return `${year}년 ${month}월 ${day}일`;
		}
		return `${year}.${month}.${day}`;
	} catch (_) {
		return "";
	}
}
export function makeDateTimeString(stringDate: string, addZero?: boolean) {
	const { year, month, day, hour, min, sec } = makeDateTime(stringDate, addZero);
	return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}
export function makeTimeString(stringDate: string, addZero?: boolean, toString?: boolean) {
	const { hour, min, sec, msec } = makeDateTime(stringDate, addZero);
	if (toString) {
		return `${hour}시 ${min}분 ${sec}초 ${msec}Z`;
	}
	return `${hour}:${min}:${sec}.${msec}`;
}

export function addNumberZero(num: number, isMsec?: boolean): string {
	// millisecond
	// 10 미만일 때 00x , 100 미만일 때 0xx
	if (isMsec) {
		if (num < 10) return `00${num}`;
		if (num < 100) return `0${num}`;
	}
	if (num < 10) return `0${num}`;
	return `${num}`;
}

export function convertStringToDateTime(dateString: string): number {
	let converted = dayjs(dateString).toDate().getTime() / 1_000 + 9 * 60 * 60;
	return converted;
}

export function initDateRange(): { start: string; end: string };
export function initDateRange(isDate: boolean): { start: Date; end: Date };
export function initDateRange(isDate?: boolean): { start: string | Date; end: string | Date } {
	const today = dayjs().set("hour", 0).set("minute", 0).set("second", 0).toDate();
	const startMonth = today.getMonth();
	const endMonth = startMonth + 1;
	const startDate = today;
	const endDate = dayjs(today).add(1, "day").subtract(1, "second").toDate();
	if (isDate) {
		return { start: startDate, end: endDate };
	}
	return { start: startDate.toISOString(), end: endDate.toISOString() };
}
