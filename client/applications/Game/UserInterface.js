import {EnumShapes} from "./libs/Enums.js";
import {secToMinSec} from "../../core/UTILS.js";

const FigureEmoji = {};
FigureEmoji[EnumShapes.Tetraedron] = '🔺';
FigureEmoji[EnumShapes.Sphere] = '🔴';
FigureEmoji[EnumShapes.Box] = '🟥';

const PlaceEmoji = {};
PlaceEmoji[0] = '🏆';
PlaceEmoji[1] = '🥈';
PlaceEmoji[2] = '🥉';

class UserInterface {
	constructor(app) {
		this.app = app;

		this.content = document.createElement("div");
		this.content.style.position = 'absolute';
		this.content.style.width =
			this.content.style.height = '100%';
		this.content.style.zIndex = '100';
		this.content.style.margin = '0 auto';
		this.app.content.appendChild(this.content);

		this.roomCode = document.createElement('h1');
		this.roomCode.innerHTML = 'CODE';
		this.roomCode.style.marginTop = '16px';
		this.roomCode.style.fontSize = '50px';
		this.roomCode.style.width = '25%';
		this.roomCode.style.cssFloat = 'left';
		//this.roomCode.style.position = 'relative';
		this.roomCode.style.color = '#FF6666';
		this.roomCode.style.textAlign = 'center';
		this.content.appendChild(this.roomCode);

		this.userList = document.createElement('h3');
		this.userList.style.marginTop = '20px';
		this.userList.style.width = '25%';
		this.userList.style.display = 'inline';
		this.userList.style.textOverflow = 'ellipsis';
		this.userList.style.color = '#444444';
		this.userList.innerHTML = 'Players:';
		this.userList.style.cssFloat = 'right';
		this.content.appendChild(this.userList);

		this.timeCode = document.createElement('h1');
		this.timeCode.style.color = '#444444';
		this.timeCode.style.width = '50%';
		this.timeCode.style.margin = '0 auto';
		this.timeCode.style.marginTop = '20px';
		this.timeCode.innerHTML = 'waiting for players';
		this.timeCode.style.textAlign = 'center';
		this.content.appendChild(this.timeCode);

		this.resize()
	}

	resize() {

	}

	set code(code) {
		this.roomCode.innerHTML = code;
	}

	set time(time) {
		// todo time
		this.timeCode.innerHTML = secToMinSec(time);
	}

	updateUserList() {
		let text = 'Players:<br>', userList = [];
		for (let key in this.app.players)
			if (this.app.players.hasOwnProperty(key)) {
				let player = this.app.players[key];
				userList.push({
					wins: player.wins,
					name: player.nickname,
					figure: player.figure.userData.shape,
					inGame: player.inGame,
				})
			}

		userList.sort((a, b) => {
			return b.wins - a.wins;
		});

		for (let i = 0; i < userList.length; i++) {
			let line = `${PlaceEmoji[i] || i + 1}\t${userList[i].wins}\t${FigureEmoji[userList[i].figure]}\t${userList[i].name} `;
			if (!userList[i].inGame) line = `<i>${line}</i>`;
			text += `${line}<br>`
		}
		this.userList.innerHTML = text;
	}
}

export {UserInterface};
