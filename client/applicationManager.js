import {CloudClient} from 'client/core/cloudClient.js';

class ApplicationManager extends CloudClient {
	constructor(cloudClient/*CloudClient*/) {
		super(cloudClient);

		this.isMaster = false;
		this.application = null;
	}

	onConnected() {
		log('Подключен');
	}

	onDisconnected() {
		log('Отключен');
	}

	onStatus(msg) {
		log('STATUS:', msg);
	}

	onMessage(msg) {
		log('message get:', msg);
	}

	serverMessage(msg) {
		log('server', msg);
	}

	onMyData(data) {
		log('nickname', data);
	}

	onKicked(msg) {
		log('kicked', msg);
	}

	onExitGame(msg) {
		log('disconnected', msg);
	}

	onPlayerEnter(msg) {
		log('player enter', msg);
	}

	onPlayerLeave(msg) {
		log('player leave', msg);
	}
}

export {ApplicationManager};
