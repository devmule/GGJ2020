import {CloudClient} from './core/cloudClient.js';
import {Menu} from './applications/menu.js';

class ApplicationsManager extends CloudClient {
	constructor() {
		super();
		this.screen = document.getElementById('screen');

		this.isOnline = false;

		this.appCache = new Map();
		this.application = null;

		this.openApplication(Menu)
	}

	// работа с приложениями
	openApplication(appClass) {
		if (!this.appCache[appClass])
			this.appCache[appClass] = new appClass(this.cloudBase);
		this.application = this.appCache[appClass];
		this.screen.innerHTML = '';
		this.screen.appendChild(this.application.content);
		this.application.onOpened();
	}

	// обработка событий
	onConnected() {
		this.isOnline = true;
	}

	onDisconnected() {
		this.isOnline = false;
		this.openApplication(Menu);
		// todo оповестить игрока о том, что есть проблемы с интернетом
	}

	onStatus(msg) {
		log('status', msg);
		if (this.application) this.application.onStatus(msg);
	}

	onMessage(msg) {
		log('message', msg);
		if (this.application) this.application.onMessage(msg);
	}

	serverMessage(msg) {
		log('server', msg);
	}

	onMyData(data) {
		log('nickname', data);
	}

	onGameCreated(data) {
		log('created', data);
	}

	onKicked(msg) {
		log('kicked', msg);
	}

	onEnterGame(msg) {
		log('enter game success', msg);
		// todo открыть джоистик
		//this.openApplication(Menu);
	}

	onExitGame(msg) {
		log('exit game success', msg);
		this.openApplication(Menu);
	}

	onPlayerEnter(msg) {
		log('player enter', msg);
		if (this.application) this.application.onPlayerEnter(msg);
	}

	onPlayerLeave(msg) {
		log('player exit', msg);
		if (this.application) this.application.onPlayerLeave(msg);
	}
}

export {ApplicationsManager};
