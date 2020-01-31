import {ApplicationBase} from "./ApplicationBase.js";

class Menu extends ApplicationBase {
	constructor() {
		super();

		this.content.innerHTML = 'hello, this is menu!';
	}
}

export {Menu};
