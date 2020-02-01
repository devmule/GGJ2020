import {ApplicationBase} from "../ApplicationBase.js";
import {loadScript} from "../../core/UTILS.js";
import {View3D, TView3D} from "./View3D.js";
import {Controller} from "./Controller.js";
import {Player} from "./Player.js";
import {EnumMessage} from "./libs/Enums.js";
import {UserInterface} from "./UserInterface.js";

class Game extends ApplicationBase {
	constructor(cloudBase/*CloudBase*/) {
		super(cloudBase);
		this.content.style.backgroundColor = '#efefef';
		// структура игроков с ссылками на их объекты
		this.players = {};

		// UI
		this.UI = new UserInterface(this);

		// рендерер и "управленец" физическими объектами
		this.view = null;
		this.controller = null;
		this.timestamp = Date.now();
	}

	// message events
	onStatus(msg) {
	}

	onMessage(msg) {
		let player = this.players[msg.from.id];
		switch (msg.value.type) {

			case EnumMessage.UpgradeWorld:
				// todo применить изменения
				break;

			case EnumMessage.ChoseFigure:
				// todo задать фигуру
				if (!player.figure) {
					player.figure = this.controller.createShape(msg.value);
					player.figure.userData.player = player;
				}
				break;

			case EnumMessage.MoveFigure:
				let coef = Math.sqrt(msg.value.x * msg.value.x + msg.value.z * msg.value.z);
				//log(coef, msg.value.x / coef, msg.value.z / coef);
				player.acceleration.x = msg.value.x / coef;
				player.acceleration.z = msg.value.z / coef;
				break;

			case EnumMessage.StopFigure:
				player.acceleration.x = 0;
				player.acceleration.z = 0;
				break;

			case EnumMessage.ButtonClick:
				switch (msg.value.value) {
					case EnumMessage.BtnA:
						player.jump = true;
						break;
					case EnumMessage.BtnB:
						player.force = true;
						break;
				}
				break;

			default:
				break;
		}
	}

	onPlayerEnter(msg) {
		let player = this.players[msg.value.id] = new Player(msg.value);
		this.cloudInterface.message({});
		// todo убрать
		let figure = Math.floor(Math.random() * 3);
		player.figure = this.controller.createShape(figure);
		player.figure.userData.player = player;
		//this.controller.scene.add(player.figure)
		this.UI.updateUserList();
		this.controller.startRoundIfCan();
	}

	onPlayerLeave(msg) {
		let player = this.players[msg.value.id];
		// todo удалить всё соответствующее
		delete this.players[msg.value.id];
		this.UI.updateUserList()
	}

	// other events
	onOpened() {
		// инициализировать либы
		if (!this.view)
			loadScript("applications/Game/libs/jquery-2.1.4.min.js", () => {
				loadScript("applications/Game/libs/three.min.js", () => {
					loadScript("applications/Game/libs/physi.js", () => {
						Physijs.scripts.worker = './applications/Game/libs/physijs_worker.js';
						Physijs.scripts.ammo = './ammo.js';
						this._onInited();
					})
				})
			});

	}

	_onInited() {
		// log(THREE);
		// после подгрузки либ активировать их
		this.view = new View3D(new TView3D());
		this.controller = new Controller(this.view, this);
		this.content.appendChild(this.view.renderer.domElement);
		//document.body.appendChild(this.view.renderer.domElement);
		//log(this.view, this.controller);
		this.tick();
	}

	// render ang controlling
	tick() {
		let dt, ts;
		ts = Date.now();
		dt = ts - this.timestamp;
		this.timestamp = ts;

		this.controller.tick(dt);
		this.view.scene.simulate();
		this.view.renderer.render(this.view.scene, this.view.camera);
		//if (stats) stats.update();
		requestAnimationFrame(this.tick.bind(this));
	}
}

export {Game};
