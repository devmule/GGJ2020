class Player {
	constructor(value) {
		this.id = value.id;
		this.nickname = value.nickname;

		this.figure = null;
		this.jump = false;
		this.force = false;
		this.acceleration = {
			x: 0,
			y: 0,
			z: 0,
		};
		this.updatePoints = 0;
	}
}

export {Player}
