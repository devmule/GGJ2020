class Player {
	constructor(value) {
		this.id = value.id;
		this.nickname = value.nickname;

		this.figure = null; // ссылка на фигуру
		this.jump = false; // запрос на прыжок
		this.force = false; // запрос на форс юз
		this.acceleration = { // ускорение по пунктам
			x: 0,
			y: 0,
			z: 0,
		};
		this.updatePoints = 0; // количество для изменения
	}
}

export {Player}
