"use strict";
let CloudEvents = require('./CloudEvents.js');

const WebSocket = require('ws');
const {Game, User} = require("./game");

class CloudConsole {
	constructor() {
		this.connections = {};
		this.games = {};
		this.wss = null;
	}

	start() {
		this.wss = new WebSocket.Server(options.ws);
		this.wss.on('connection', this.onOpen.bind(this));
		log(`WebSocket server launched on port ${options.ws.port}`)
	}

	onOpen(client) {
		let user = new User(client);
		user.client.send(JSON.stringify({
			type: CloudEvents.NICKNAME,
			value: user.raw(),
		}));
		this.connections[user.id] = user;

		client.onclose = () => {
			delete this.connections[user.id];
			if (user.game) user.game.leave(user);
			user = null;
		};

		client.onmessage = (msg) => {
			let game/*Game*/;
			//log(msg.data);
			let parsed = JSON.parse(msg.data);

			switch (parsed.type) {

				case CloudEvents.ENTER_GAME:
					if (user.game) {
						// запретить входить, если уже в игре
						user.client.send(JSON.stringify({
							type: CloudEvents.SERVER,
							value: 'ERROR! You need to leave game before enter'
						}));
					} else {
						game = this.games[parsed.value];
						if (game) {
							game.enter(user);
							// отправить сообщение об успешном входе
							user.client.send(JSON.stringify({
								type: CloudEvents.ENTER_GAME,
								value: game.raw()
							}));
						} else {
							user.client.send(JSON.stringify({
								type: CloudEvents.SERVER,
								value: 'ERROR! Such game is not exist'
							}));
						}
					}
					break;

				case CloudEvents.EXIT_GAME:
					if (user.game) {
						user.game.leave(user);
						// фидбэкнуть клиенту об успешности выхода
						user.client.send(JSON.stringify({
							type: CloudEvents.EXIT_GAME,
							value: 'SUCCESS! You leaved the game'
						}));
					} else {
					}
					break;

				case CloudEvents.MESSAGE:
					if (user.game) user.game.onMessage(user, parsed.value);
					break;

				case CloudEvents.NICKNAME:
					user.nickname = parsed.value;
					user.client.send(JSON.stringify({
						type: CloudEvents.NICKNAME,
						value: user.raw(),
					}));
					if (user.game) user.game.sendUpdate();
					break;

				case CloudEvents.CREATE_GAME:
					//log('create');
					if (user.game) {
						//log('already ex');
						// сказать нахалу что он может открыть только одну игру за раз
						user.client.send(JSON.stringify({
							type: CloudEvents.SERVER,
							value: 'ERROR! You can only create one game'
						}));
					} else {
						//log('create');
						game = new Game(this, user);
						user.game = game;
						this.games[game.code] = game;
						user.client.send(JSON.stringify({
							type: CloudEvents.CREATE_GAME,
							value: game.raw()
						}));
					}
					break;

				case CloudEvents.KICK:
					if (user.game && user.game.master === user && Number.isInteger(parsed.value)) {
						user.game.kick(parsed.value);
					}
					break;

				case CloudEvents.STATUS:
					if (user.game) {
						user.client.send(JSON.stringify({
							type: CloudEvents.STATUS,
							value: user.game.raw(),
						}));
					}
					break;

				default:
					break;
			}
		};
	}
}

module.exports = CloudConsole;
