class ApplicationBase {
	constructor(cloudClient/*CloudClient*/) {
		this.cloudClient = cloudClient;

		// события соединения с сервером
		this.cloudClient.addEventListener(CloudEvents.CONNECT, this.onConnected);
		this.cloudClient.addEventListener(CloudEvents.DISCONNECT, this.onDisconnected);

		// события взаимодействия с сервером
		// this.core.addEventListener(CloudEvents.ENTER_GAME, null);
		this.cloudClient.addEventListener(CloudEvents.EXIT_GAME, this.onExitGame);
		this.cloudClient.addEventListener(CloudEvents.MESSAGE, this.onMessage);
		this.cloudClient.addEventListener(CloudEvents.NICKNAME, this.onMyData);
		// this.core.addEventListener(CloudEvents.CREATE_GAME, null);
		this.cloudClient.addEventListener(CloudEvents.KICK, this.onKicked);
		// this.core.addEventListener(CloudEvents.UPDATE, null);
		this.cloudClient.addEventListener(CloudEvents.STATUS, this.onStatus);
		this.cloudClient.addEventListener(CloudEvents.SERVER, this.serverMessage);
		this.cloudClient.addEventListener(CloudEvents.PLAYER_ENTER, this.onPlayerEnter);
		this.cloudClient.addEventListener(CloudEvents.PLAYER_LEAVE, this.onPlayerLeave);
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

export {ApplicationBase};
