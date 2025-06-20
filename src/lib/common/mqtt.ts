import mqtt from "mqtt";
import { logger } from "./logger";

export type MqttClient = mqtt.MqttClient;

// 연결된 토픽을 추적하는 집합
export const subscribedTopics: Set<string> = new Set();

// 재연결 시도 횟수
let reconnectAttempts: number = 0;

// MQTT 클라이언트 인스턴스
let mqttClient: mqtt.MqttClient | null = null;

//#region Methods
// MQTT 브로커에 연결하는 함수
export async function connect(
	ip: string,
	port: number,
	options?: mqtt.IClientOptions | undefined,
): Promise<MqttClient> {
	// MQTT 브로커에 연결하기 위한 URL
	const url: string = `ws://${ip}:${port}`;
	reconnectAttempts = 0;

	// 비동기 처리를 위한 Promise 객체 리턴
	return new Promise((resolve, reject) => {
		// 이미 MQTT 클라이언트가 존재하면 해당 클라이언트 반환
		if (mqttClient) {
			logger.trace("MQTT Client Already Exist");
			resolve(mqttClient);
			return;
		}

		mqttClient = mqtt.connect(url, options);

		onConnect(() => {
			logger.info("MQTT Connect Success");
			mqttClient?.setMaxListeners(6);
			resolve(mqttClient!);
			return;
		});

		onError((error) => {
			if (reconnectAttempts >= 10) {
				mqttClient?.end(true, () => {
					logger.info("MQTT Disconnected");
				});
				mqttClient = null;

				reject(error);

				return;
			}
			reconnectAttempts++;

			logger.info(`Retry Connect MQTT ${reconnectAttempts}`);
		});
	});
}

// MQTT 클라이언트가 연결되었는지 여부를 반환하는 함수
export function isConnected(): boolean {
	// 클라이언트가 없으면 연결되지 않은 것으로 간주
	if (!mqttClient) return false;

	return mqttClient.connected;
}

// 특정 주제를 구독하는 함수
export function subscribe(topic: string, callback: (message: string) => void): void {
	// 클라이언트가 없으면 Throw Error
	if (isConnected() == false) {
		throw new Error("MQTT Client Not Exist");
	}

	// 이미 구독된 주제인지 확인 , 클라이언트가 없으면 구독하지 않음
	if (subscribedTopics.has(topic)) {
		return;
	}

	// 주제를 구독하고, 메시지가 도착할 때 호출할 콜백 함수 등록
	mqttClient!.subscribe(topic, (err) => {
		if (err) {
			throw err;
		} else {
			subscribedTopics.add(topic);
			logger.info(`MQTT Subscribe Success (${topic})`);
		}
	});

	// 메시지 수신 시 콜백 함수 호출
	mqttClient!.on("message", (receivedTopic, message) => {
		if (receivedTopic === topic) {
			// 메시지를 문자열로 변환하여 콜백 함수 호출
			callback(message.toString());
		}
	});
}

function removeAllListeners(): void {
	if (mqttClient) {
		mqttClient.removeAllListeners();
	}
}

// 특정 주제의 구독을 해제하는 함수
function unsubscribe(topic: string): void {
	// 클라이언트가 없으면 Throw Error
	if (isConnected() == false) {
		throw new Error("MQTT Client Not Exist");
	}

	mqttClient!.unsubscribe(topic, (err) => {
		if (err) {
			throw err;
		} else {
			subscribedTopics.delete(topic);
			logger.info(`MQTT Unsubscribe Success (${topic})`);
		}
	});
}

// MQTT 클라이언트와의 연결을 종료하는 함수
function disconnect(): void {
	// 연결된 모든 주제를 클리어
	subscribedTopics.clear();

	// 클라이언트가 없으면 return
	if (!mqttClient) return;

	mqttClient.end(() => {
		logger.info("MQTT Disconnected");
	});
}

// MQTT 클라이언트의 연결 이벤트에 콜백 등록하는 함수
function onConnect(callback: () => void): void {
	// 클라이언트가 없으면 Throw Error
	if (!mqttClient) {
		throw new Error("MQTT Client Not Exist");
	}

	mqttClient.on("connect", () => {
		callback();
	});
}

// MQTT 클라이언트의 오류 이벤트에 콜백 등록하는 함수
function onError(callback: (error: Error) => void): void {
	// 클라이언트가 없으면 Throw Error
	if (!mqttClient) {
		throw new Error("MQTT Client Not Exist");
	}

	mqttClient.on("error", (error) => {
		callback(error);
	});
}

//#endregion

export default {
	connect,
	isConnected,
	subscribe,
	unsubscribe,
	disconnect,
	onError,
	removeAllListeners,
};
