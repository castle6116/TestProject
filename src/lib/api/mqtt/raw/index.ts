import { PUBLIC_MQTT_TOPIC } from '$env/static/public';
import mqtt from '$lib/common/mqtt';
import type { IRawsData } from './schema';

// Chart 데이터 조회
export function streamRawData(callback: (message: IRawsData) => void): void {
	mqtt.subscribe(PUBLIC_MQTT_TOPIC, (message) => {
		const tempArray = message.split(' ');
		const timestampString = tempArray[tempArray.length - 1];
		const fieldSetString = tempArray[tempArray.length - 2];
		const tagSetString = tempArray[0];

		const chartData: IRawsData = {
			time: parseInt(timestampString),
			feed: 0,
			fov: 0,
			load: 0,
			loss: 0,
			predict: 0,
			offset_x: 0,
			offset_y: 0,
			offset_z: 0,
			sov: 0,
			interval: 0,
			product_id: '',

			work_id: '',
			line_id: '',
			op_code: '',
			mcode: '',
			tcode: '',
			main_progm: '',
			sub_progm: '',
			status: ''
		};
		// chartData['time'] = parseInt(timestampString);

		for (const fieldSet of fieldSetString.split(',')) {
			chartData[fieldSet.split('=')[0]] = parseFloat(fieldSet.split('=')[1]);
		}

		for (const tagSet of tagSetString.split(',')) {
			chartData[tagSet.split('=')[0]] = tagSet.split('=')[1];
		}

		callback(chartData);
	});
}
