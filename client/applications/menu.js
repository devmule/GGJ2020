import {ApplicationBase} from "./ApplicationBase.js";

class Menu extends ApplicationBase {
	constructor(cloudBase/*CloudBase*/) {
		super(cloudBase);
		this.content.style.backgroundColor = '#353535';

		this.widthBlocker = document.createElement('div');
		this.content.appendChild(this.widthBlocker);
		this.widthBlocker.style.margin = '40px auto';
		this.widthBlocker.style.maxWidth = '500px';

		let labelConnect = document.createElement('h1');
		labelConnect.width = '100%';
		labelConnect.style.textAlign = 'center';
		labelConnect.style.margin = '0 auto';
		labelConnect.innerHTML = 'ENTER EXIST GAME';
		this.widthBlocker.appendChild(labelConnect);

		this.messageline = document.createElement('input');
		this.messageline.style.textTransform = 'uppercase';
		this.messageline.style.border =
			this.messageline.style.outline = 'none';
		this.messageline.style.fontSize = '32px';
		this.messageline.style.display = 'inline-block';
		this.messageline.style.color = '#FF3737';
		this.messageline.style.backgroundColor = '#e5e5e5';
		this.messageline.style.width = '268px';
		this.messageline.style.height = '60px';
		this.messageline.style.margin = '16px 0';
		this.messageline.style.padding = '0 16px';
		this.widthBlocker.appendChild(this.messageline);

		this.enterCode = document.createElement('button');
		this.enterCode.addEventListener('click', this.onSendConnectClicked.bind(this));
		this.enterCode.style.border =
			this.enterCode.style.outline = 'none';
		this.enterCode.style.display = 'inline-block';
		this.enterCode.style.width = '200px';
		this.enterCode.style.height = '60px';
		this.enterCode.innerHTML = 'CONNECT';
		this.enterCode.style.fontSize = '24px';
		this.enterCode.style.margin = '16px 0';
		this.enterCode.style.cursor = 'pointer';
		this.widthBlocker.appendChild(this.enterCode);

		let labelCreate = document.createElement('h1');
		labelCreate.width = '100%';
		labelCreate.style.textAlign = 'center';
		labelCreate.style.margin = '0 auto';
		labelCreate.innerHTML = 'OR CREATE ONE';
		this.widthBlocker.appendChild(labelCreate);

		this.createGame = document.createElement('button');
		this.createGame.addEventListener('click', this.onCreateGameClicked.bind(this));
		this.createGame.style.border =
			this.createGame.style.outline = 'none';
		this.createGame.style.display = 'inline-block';
		this.createGame.style.width = '200px';
		this.createGame.style.height = '60px';
		this.createGame.innerHTML = 'CREATE';
		this.createGame.style.fontSize = '24px';
		this.createGame.style.margin = '16px 0';
		this.createGame.style.cursor = 'pointer';
		this.widthBlocker.appendChild(this.createGame);
	}

	onOpened() {
	}

	onCreateGameClicked() {
		this.cloudInterface.create();
	}

	onSendConnectClicked(e) {
		let value = this.messageline.value.toUpperCase();
		if (value.length <= 0) return;
		this.cloudInterface.enterGame(value);
	}

	onChangeNicknameClicked() {
	}
}

export {Menu};
