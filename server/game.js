"use strict";
let options = require('./CloudEvents');
let CloudEvents = require('./CloudEvents.js');

let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let IDCount = 0;

function generateCode(len) {
	let w = '';
	for (let i = 0; i < len; i++)
		w += letters[Math.floor(Math.random() * letters.length)];
	return w;
}

class User {
	constructor(client) {
		this.client = client;
		this.id = ++IDCount;
		this.nickname = 'Guest' + this.id.toString();
		this.game = null;
	}

	raw() {
		return {
			id: this.id,
			nickname: this.nickname,
		}
	}
}

class Game {
	constructor(server, master) {
		// сделать неповторимый код: пока повторяется - перегенерить
		this.code = generateCode(codeLen);
		while (server.games[this.code]) this.code = generateCode(codeLen);

		this.server = server; // в него пускать сообщения для геймеров и мастера
		// каждый игрок отправляет сообщения мастеру, мастер может броадкастить или отправлять напрямую
		this.master = master;
		this.gamers = [];
	}

	raw() {
		let gamers = [];
		for (let i = 0; i < this.gamers.length; i++) gamers.push(this.gamers[i].raw());
		return {
			code: this.code,
			master: this.master.raw(),
			gamers: gamers,
		}
	}

	onMessage(user, value) {
		// мастер может как отправить всем, так и отправиль только одному игроку
		if (user === this.master) {
			for (let i = 0; i < this.gamers.length; i++)
				// если есть value.to, то
				if (!value.to || this.gamers[i].id === value.to) {
					this.gamers[i].client.send(JSON.stringify({
						type: CloudEvents.MESSAGE,
						value: value,
					}));
				}
		} else {
			// игрок может только отправить мастеру
			this.master.client.send(JSON.stringify({
				type: CloudEvents.MESSAGE,
				value: value,
				from: user.raw(),
			}));
		}
	}

	enter(user) {
		user.game = this;
		this.gamers.push(user);
		this.master.client.send(JSON.stringify({
			type: CloudEvents.PLAYER_ENTER,
			value: user.raw(),
		}));
		//this.sendUpdate()
	}

	kick(id) {
		// взаимодействие для kick
		let user = null;
		for (let i = 0; i < this.gamers.length; i++) {
			if (this.gamers[i].id === id) {
				user = this.gamers[i];
				break;
			}
		}
		if (!user) return;

		this.leave(user);
		user.client.send(JSON.stringify({
			type: CloudEvents.KICK,
			value: 'KICKED! This game closed its doors for you!'
		}));
	}

	leave(user) {
		if (user === this.master) {
			this.close()
		} else {
			// выкинуть игрока
			user.game = null;
			this.gamers.splice(this.gamers.indexOf(user), 1);
			this.master.client.send(JSON.stringify({
				type: CloudEvents.PLAYER_LEAVE,
				value: user.raw(),
			}));
			//this.sendUpdate()
		}
	}

	close() {
		// закрыть игру
		this.gamers.push(this.master);
		for (let i = 0; i < this.gamers.length; i++) {
			let user = this.gamers[i];
			user.game = null;
			user.client.send(JSON.stringify({
				type: CloudEvents.EXIT_GAME,
				value: 'CLOSED! This game closed its doors!'
			}));
		}
		this.gamers = null;
		this.master = null;
		this.server.games[this.code] = null;
		delete this;
	}

	sendUpdate() {
		// send to master
		this.master.client.send(JSON.stringify({
			type: CloudEvents.STATUS,
			value: this.raw(),
		}));
	}
}

module.exports = {User, Game};
