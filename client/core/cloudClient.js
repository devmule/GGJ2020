class CloudClient {
	constructor(cloudBase/*cloudBase*/) {
		this.cloudBase = cloudBase;

		// события соединения с сервером
		this.cloudBase.addEventListener(CloudEvents.CONNECT, this.onConnected);
		this.cloudBase.addEventListener(CloudEvents.DISCONNECT, this.onDisconnected);

		// события взаимодействия с сервером
		// this.cloudBase.addEventListener(CloudEvents.ENTER_GAME, null);
		this.cloudBase.addEventListener(CloudEvents.EXIT_GAME, this.onExitGame);
		this.cloudBase.addEventListener(CloudEvents.MESSAGE, this.onMessage);
		this.cloudBase.addEventListener(CloudEvents.NICKNAME, this.onMyData);
		this.cloudBase.addEventListener(CloudEvents.CREATE_GAME, this.onGameCreated);
		this.cloudBase.addEventListener(CloudEvents.KICK, this.onKicked);
		// this.cloudBase.addEventListener(CloudEvents.UPDATE, null);
		this.cloudBase.addEventListener(CloudEvents.STATUS, this.onStatus);
		this.cloudBase.addEventListener(CloudEvents.SERVER, this.serverMessage);
		this.cloudBase.addEventListener(CloudEvents.PLAYER_ENTER, this.onPlayerEnter);
		this.cloudBase.addEventListener(CloudEvents.PLAYER_LEAVE, this.onPlayerLeave);
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

	onGameCreated(data) {

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
