import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	// 서버 옵션 설정
	server: {
		host: true, //서버 IP 설정
		port: 10000, //서버 포트 설정
		//origin: "",	//origin 헤더 설정
		cors: true, //CORS 설정 (boolean으로는 모든 Origin 허용/차단만 설정 가능하고 특정 Origin 설정은 cors 패키지에서 제공하는 CorsOption 객체 이용)
		watch: {
			usePolling: true
		}
	}
});
