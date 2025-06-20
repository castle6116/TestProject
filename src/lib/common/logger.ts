import pino from "pino";
import { browser, dev } from "$app/environment";
import { PUBLIC_LOG_LEVEL } from "$env/static/public";
import dayjs from "dayjs";

let options: pino.LoggerOptions = {};

if (!browser) {
	options = {
		level: PUBLIC_LOG_LEVEL,
		transport: {
			target: "pino-pretty",
			options: {
				destination: dev ? undefined : `./logs/${dayjs().format("YYYY-MM-DD")}.log`,
				colorize: true,
			},
		},
	};
} else {
	options = {
		level: PUBLIC_LOG_LEVEL,
		browser: {
			disabled: false,
			write: {
				trace: function (o) {
					console.log(o);
				},
				debug: function (o) {
					console.log(o);
				},
				info: function (o) {
					console.info(o);
				},
				error: function (o) {
					console.error(o);
				},
				fatal: function (o) {
					console.error(o);
				},
			},
		},
	};
}

export const logger = pino(options);
