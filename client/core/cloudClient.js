import {CloudBase} from "./CloudBase.js";
import {CloudEvents} from "./CloudEvents.js";

class CloudClient {
	constructor() {
		this.cloudBase = new CloudBase();

		// события соединения с сервером
		this.cloudBase.addEventListener(CloudEvents.CONNECT, this.onConnected.bind(this));
		this.cloudBase.addEventListener(CloudEvents.DISCONNECT, this.onDisconnected.bind(this));

		// события взаимодействия с сервером
		this.cloudBase.addEventListener(CloudEvents.ENTER_GAME, this.onEnterGame.bind(this));
		this.cloudBase.addEventListener(CloudEvents.EXIT_GAME, this.onExitGame.bind(this));
		this.cloudBase.addEventListener(CloudEvents.MESSAGE, this.onMessage.bind(this));
		this.cloudBase.addEventListener(CloudEvents.NICKNAME, this.onMyData.bind(this));
		this.cloudBase.addEventListener(CloudEvents.CREATE_GAME, this.onGameCreated.bind(this));
		this.cloudBase.addEventListener(CloudEvents.KICK, this.onKicked.bind(this));
		// this.cloudBase.addEventListener(CloudEvents.UPDATE, null);
		this.cloudBase.addEventListener(CloudEvents.STATUS, this.onStatus.bind(this));
		this.cloudBase.addEventListener(CloudEvents.SERVER, this.serverMessage.bind(this));
		this.cloudBase.addEventListener(CloudEvents.PLAYER_ENTER, this.onPlayerEnter.bind(this));
		this.cloudBase.addEventListener(CloudEvents.PLAYER_LEAVE, this.onPlayerLeave.bind(this));
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

	onEnterGame(msg) {
	}

	onExitGame(msg) {
	}

	onPlayerEnter(msg) {
	}

	onPlayerLeave(msg) {
	}
}

export {CloudClient};
