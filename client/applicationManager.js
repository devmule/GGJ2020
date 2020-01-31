import {CloudClient} from 'client/core/cloudClient.js';

class ApplicationManager extends CloudClient {
	constructor(cloudBase/*cloudBase*/) {
		super(cloudBase);

		this.isOnline = false;

		this.isMaster = false;
		this.application = null;
	}

	onConnected() {
		this.isOnline = true;
	}

	onDisconnected() {
		this.isOnline = false;
		// todo выкинуть в начало
		//  , оповестить игрока о том, что есть проблемы с интернетом
	}

	onStatus(msg) {
		this.isMaster = true;
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

	onGameCreated(data) {
		log('created', data);
	}

	onKicked(msg) {
		log('kicked', msg);
	}

	onExitGame(msg) {
		// без разницы был ли ты мастером, выйдя из игры ты больше не мастер
		this.isMaster = false;
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
