import {ApplicationBase} from "../ApplicationBase.js";

class Game extends ApplicationBase {
	constructor(cloudBase/*CloudBase*/) {
		super(cloudBase);
		this.content.style.backgroundColor = '#AF3535';

	}
}

export {Game};
