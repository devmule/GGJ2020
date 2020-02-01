import {ApplicationBase} from "../ApplicationBase.js";
import {loadScript} from "../../core/UTILS.js";
import {View3D, TView3D} from "./View3D.js"

class Game extends ApplicationBase {
	constructor(cloudBase/*CloudBase*/) {
		super(cloudBase);
		this.content.style.backgroundColor = '#AF3535';

		this.view = null;
	}

	onOpened() {
		// инициализировать либы
		if (!this.view)
			loadScript("applications/Game/libs/three.min.js", () => {
				loadScript("applications/Game/libs/physi.js", () => {
					Physijs.scripts.worker = './applications/Game/libs/physijs_worker.js';
					Physijs.scripts.ammo = './ammo.js';
					this._onInited();
				})
			})
	}

	_onInited() {
		// todo после подгрузки либ активировать их
		this.view = new View3D(new TView3D());
		this.content.appendChild(this.view.renderer.domElement);
	}
}

export {Game};
