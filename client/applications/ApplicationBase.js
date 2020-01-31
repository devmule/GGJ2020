class ApplicationBase {
	constructor(cloudBase/*CloudBase*/) {
		this.cloudInterface = cloudBase;
		this.content = document.createElement('div');
		this.content.className = 'content';

		this.isMaster = false;
	}

	onOpened() {
	}

	onStatus(msg) {
	}

	onMessage(msg) {
	}

	onPlayerEnter(msg) {
	}

	onPlayerLeave(msg) {
	}
}

export {ApplicationBase};
