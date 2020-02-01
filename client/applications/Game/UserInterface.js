class UserInterface {
	constructor(app) {
		this.app = app;

		this.content = document.createElement("div");
		this.content.style.position = 'absolute';
		this.content.style.zIndex = '100';
		this.app.content.appendChild(this.content);

		this.time = document.createElement('h1');

		this.roomCode = document.createElement('h1');
		this.roomCode.innerHTML = 'sdfsdfafsdfsafd';
		this.roomCode.style.position = 'relative';
		this.roomCode.style.color = '#666666';
		this.roomCode.style.top = '0';
		this.roomCode.style.right = '0';
		this.roomCode.style.cssFloat = 'right';
		this.content.appendChild(this.roomCode);

		this.resize()
	}

	resize() {

	}

	set code(code) {
		this.roomCode.innerHTML = code
	}

	updateUserList() {
	}
}

export {UserInterface};
