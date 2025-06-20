import { RAMS_ERROR_CODES } from '$constants/exception';
import { PUBLIC_GRAPHQL_URL, PUBLIC_MQTT_IP, PUBLIC_MQTT_PORT } from '$env/static/public';
import { HandleException } from '$lib/common/exception';
import graphql from '$lib/common/graphql';
import { logger } from '$lib/common/logger';
import mqtt from '$lib/common/mqtt';

export const ssr = false;
// export const csr = true;
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load() {
	let isMqttConnected = false;

	try {
		const mqttPort = PUBLIC_MQTT_PORT as unknown as number;

		await mqtt.connect(PUBLIC_MQTT_IP, mqttPort, {
			reconnectPeriod: 500,
			connectTimeout: 500,
			keepalive: 1000
		});

		logger.trace(`Create MQTT Client Success`);
		isMqttConnected = true;
	} catch (err) {
		HandleException(RAMS_ERROR_CODES.MQTT_CREATE_ERROR, new Error(err as string));
	}

	// Create GraphQL Client
	try {
		graphql.createGraphqlClient(PUBLIC_GRAPHQL_URL);
		graphql.createGraphqlWsClient(PUBLIC_GRAPHQL_URL);

		logger.trace(`Create GraphQL Client Success`);
	} catch (err) {
		HandleException(RAMS_ERROR_CODES.GQL_CREATE_ERROR, new Error(err as string));
	}

	return {};
}
