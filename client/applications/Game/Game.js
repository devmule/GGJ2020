import {ApplicationBase} from "../ApplicationBase.js";
import {loadScript} from "../../core/UTILS.js";
import {View3D, TView3D} from "./View3D.js";
import {Controller} from "./Controller.js";
import {Player} from "./Player.js";
import {EnumMessage} from "./libs/Enums.js";

class Game extends ApplicationBase {
	constructor(cloudBase/*CloudBase*/) {
		super(cloudBase);
		//this.content.style.backgroundColor = '#AF3535';
		// todo структура игроков с ссылками на их объекты
		this.players = {};

		// рендерер и "управленец" физическими объектами
		this.view = null;
		this.controller = null;
	}

	// message events
	onStatus(msg) {
	}

	onMessage(msg) {
		let player = this.players[msg.from.id];
		switch (msg.type) {

			case EnumMessage.UpgradeWorld:
				// todo применить изменения
				break;

			case EnumMessage.ChoseFigure:
				// todo задать фигуру
				if (!player.figure)
					player.figure = this.controller.createShape(msg.value);
				break;

			case EnumMessage.MoveFigure:
				// todo задать направление движения
				let coef = Math.sqrt(msg.x * msg.x + msg.y * msg.y);
				player.acceleration.x = msg.x / coef;
				player.acceleration.y = msg.y / coef;
				player.isMoving = true;
				break;

			case EnumMessage.StopFigure:
				player.isMoving = false;
				break;

			case EnumMessage.ButtonClick:
				switch (msg.value.value) {
					case EnumMessage.BtnA:
						// todo прыжок
						break;
					case EnumMessage.BtnB:
						// todo сила
						break;
				}
				break;

			default:
				break;
		}
	}

	onPlayerEnter(msg) {
		this.players[msg.value.id] = new Player(msg.value);
	}

	onPlayerLeave(msg) {
		let player = this.players[msg.value.id];
		// todo удалить всё соответствующее
		delete this.players[msg.value.id];
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
		this.controller = new Controller(this.view);
		this.content.appendChild(this.view.renderer.domElement);
		//document.body.appendChild(this.view.renderer.domElement);
		//log(this.view, this.controller);
		this.tick();
	}

	// render ang controlling
	tick() {
		// todo dt и изменения в движении
		//this.controller.tick(dt);
		this.view.scene.simulate();
		this.view.renderer.render(this.view.scene, this.view.camera);
		//if (stats) stats.update();
		requestAnimationFrame(this.tick.bind(this));
		console.log('tick');
	}
}

export {Game};
