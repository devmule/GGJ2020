class CloudClient {
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
	}

	onDisconnected() {
	}

	onStatus(msg) {
	}

	onMessage(msg) {
	}

	serverMessage(msg) {
	}

	onMyData(data) {
	}

	onKicked(msg) {
	}

	onExitGame(msg) {
	}

	onPlayerEnter(msg) {
	}

	onPlayerLeave(msg) {
	}
}

export {CloudClient};
