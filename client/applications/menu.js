import {ApplicationBase} from "./ApplicationBase.js";

class Menu extends ApplicationBase {
	constructor(cloudBase/*CloudBase*/) {
		super(cloudBase);
		this.content.style.backgroundColor = '#353535';

		this.GameConnection = document.createElement('div');
		this.content.appendChild(this.GameConnection);
		this.GameConnection.style.margin = '40px auto';
		this.GameConnection.style.maxWidth = '500px';

		let labelConnect = document.createElement('h1');
		labelConnect.width = '100%';
		labelConnect.style.textAlign = 'center';
		labelConnect.style.margin = '0 auto';
		labelConnect.innerHTML = 'ENTER EXIST GAME';
		this.GameConnection.appendChild(labelConnect);

		this.messageline = document.createElement('input');
		this.messageline.style.textTransform = 'uppercase';
		this.messageline.style.border =
			this.messageline.style.outline = 'none';
		this.messageline.style.fontSize = '32px';
		this.messageline.style.display = 'inline-block';
		this.messageline.style.color = '#FF3737';
		this.messageline.style.backgroundColor = '#e5e5e5';
		this.messageline.style.width = 'calc(60% - 32px)';
		this.messageline.style.height = '60px';
		this.messageline.style.margin = '16px 0';
		this.messageline.style.padding = '0 16px';
		this.GameConnection.appendChild(this.messageline);

		this.enterCode = document.createElement('button');
		this.enterCode.addEventListener('click', this.onSendConnectClicked.bind(this));
		this.enterCode.style.border =
			this.enterCode.style.outline = 'none';
		this.enterCode.style.display = 'inline-block';
		this.enterCode.style.width = '40%';
		this.enterCode.style.height = '60px';
		this.enterCode.innerHTML = 'CONNECT';
		this.enterCode.style.fontSize = '24px';
		this.enterCode.style.margin = '16px 0';
		this.enterCode.style.cursor = 'pointer';
		this.GameConnection.appendChild(this.enterCode);

		let labelCreate = document.createElement('h1');
		labelCreate.width = '100%';
		labelCreate.style.textAlign = 'center';
		labelCreate.style.margin = '0 auto';
		labelCreate.innerHTML = 'OR CREATE ONE';
		this.GameConnection.appendChild(labelCreate);

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
		this.GameConnection.appendChild(this.createGame);

		this.NicknameChange = null;
		this.nickLine = null;
		this.enterNick = null;
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
		let value = this.nickLine.value;
		if (value.length < 3) return;
		this.cloudInterface.nickname(value);
		this.setMenuWindow();
	}

	// windows
	setNicknameWindow() {
		if (!this.NicknameChange) {
			this.NicknameChange = document.createElement('div');
			this.NicknameChange.style.margin = '40px auto';
			this.NicknameChange.style.maxWidth = '500px';

			let labelConnect = document.createElement('h1');
			labelConnect.width = '100%';
			labelConnect.style.textAlign = 'center';
			labelConnect.style.margin = '0 auto';
			labelConnect.innerHTML = 'Назовите себя =) 3 знака минимум';
			this.NicknameChange.appendChild(labelConnect);

			this.nickLine = document.createElement('input');
			this.nickLine.style.textTransform = 'uppercase';
			this.nickLine.style.border =
				this.nickLine.style.outline = 'none';
			this.nickLine.style.fontSize = '32px';
			this.nickLine.style.display = 'inline-block';
			this.nickLine.style.color = '#FF3737';
			this.nickLine.style.backgroundColor = '#e5e5e5';
			this.nickLine.style.width = 'calc(60% - 32px)';
			this.nickLine.style.height = '60px';
			this.nickLine.style.margin = '16px 0';
			this.nickLine.style.padding = '0 16px';
			this.NicknameChange.appendChild(this.nickLine);

			this.enterNick = document.createElement('button');
			this.enterNick.addEventListener('click', this.onChangeNicknameClicked.bind(this));
			this.enterNick.style.border =
				this.enterNick.style.outline = 'none';
			this.enterNick.style.display = 'inline-block';
			this.enterNick.style.width = '40%';
			this.enterNick.style.height = '60px';
			this.enterNick.innerHTML = 'готово';
			this.enterNick.style.fontSize = '24px';
			this.enterNick.style.margin = '16px 0';
			this.enterNick.style.cursor = 'pointer';
			this.NicknameChange.appendChild(this.enterNick);
		}
		this.content.innerHTML = '';
		this.content.appendChild(this.NicknameChange);
	}

	setMenuWindow() {
		this.content.innerHTML = '';
		this.content.appendChild(this.GameConnection)
	}
}

export {Menu};
