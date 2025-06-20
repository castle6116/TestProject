import { logger } from "$lib/common/logger";
import { error } from "@sveltejs/kit";

// Error 인터페이스를 이용하여 클래스 생성
class CommonException extends Error {
	code: string;

	constructor(code: string, error: Error) {
		super();

		this.code = code;
		this.message = error.message;
		this.stack = error.stack ? error.stack : new Error().stack;
	}
}

// System Exception 클래스 정의 (실행 불가한 상황)
export class SystemException extends CommonException {
	constructor(code: string, error: Error) {
		super(code, error);
		logger.error(`[${this.code}] ${this.message} (${this.stack})`);
	}
}

// Application Exception 클래스 정의 (알림 상황)
export class AppException extends CommonException {
	constructor(code: string, error: Error) {
		super(code, error);
		logger.warn(`[${this.code}] ${this.message} (${this.stack})`);
	}
}

export function HandleException(
	code: string,
	err: Error,
	exceptHandler?: (exception: AppException) => void,
) {
	// System Exception 여부 확인
	if (code.indexOf("SYS", 0) >= 0) {
		const except = new SystemException(code, err);

		// System Exception일 경우 예외 Throw
		throw error(500, {
			code: except.code,
			stack: except.stack,
			message: except.message,
			level: "Fatal",
		});
	}

	// App Exception일 경우 등록한 콜백 함수 호출
	const except = new AppException(code, err);
	// TODO: 에러 팝업/Form 호출
	if (exceptHandler != undefined) {
		exceptHandler(except);
	}
}
