import {ApplicationBase} from "../ApplicationBase.js";
import {loadScript} from "../../core/UTILS.js";
import {View3D, TView3D} from "./View3D.js";
import {Controller} from "./Controller.js";

class Game extends ApplicationBase {
	constructor(cloudBase/*CloudBase*/) {
		super(cloudBase);
		//this.content.style.backgroundColor = '#AF3535';

		this.view = null;
		this.controller = null;
	}

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

	tick() {
		//this.controller.tick(dt);
		this.view.scene.simulate();
		this.view.renderer.render(this.view.scene, this.view.camera);
		//if (stats) stats.update();
		requestAnimationFrame(this.tick.bind(this));
		console.log('tick');
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
}

export {Game};
