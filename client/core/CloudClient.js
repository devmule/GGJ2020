import {EventDispatcher} from './EventDispatcher.js';

class CloudClient extends EventDispatcher {
	constructor() {
		super();
		this.connection = new WebSocket(`ws://${options.ws.host}:${options.ws.port}`);
		this.connection.addEventListener('open', this._onOpen.bind(this));
		this.connection.addEventListener('close', this._onCloseConnection.bind(this));
		this.connection.addEventListener('message', this._onMessage.bind(this));
	}

	_onOpen() {
		this.dispatchEvent(CloudEvents.CONNECT);
	}

	_onMessage(msg) {
		let parsed = JSON.parse(msg.data);
		this.dispatchEvent(parsed.type, parsed);
	}

	_onCloseConnection() {
		this.dispatchEvent(CloudEvents.DISCONNECT);
	}

	sendObj(obj) {
		if (this.connection.readyState === WebSocket.OPEN) {
			this.connection.send(JSON.stringify(obj));
		}
	}

	// SEND COMMANDS TO SERVER
	enterGame(key) {
		if (key)
			this.sendObj({
				type: CloudEvents.ENTER_GAME,
				value: key,
			});
	}

	exitGame() {
		this.sendObj({
			type: CloudEvents.EXIT_GAME,
		});
	}

	kick(playerID) {
		this.sendObj({
			type: CloudEvents.KICK,
			value: playerID
		});
	}

	message(message/*Object*/) {
		this.sendObj({
			type: CloudEvents.MESSAGE,
			value: message,
		});
	}

	nickname(nickname) {
		this.sendObj({
			type: CloudEvents.NICKNAME,
			value: nickname,
		});
	}

	create() {
		this.sendObj({
			type: CloudEvents.CREATE_GAME,
		});
	}

	status() {
		this.sendObj({
			type: CloudEvents.STATUS,
		});
	}
}

export {CloudClient};
