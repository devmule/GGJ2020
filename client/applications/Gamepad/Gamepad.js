import {ApplicationBase} from "../ApplicationBase.js";
import {EnumMessage} from "../Game/libs/Enums.js";

class Gamepad extends ApplicationBase {
	constructor(cloudBase/*CloudBase*/) {
		super(cloudBase);
		this.moveDtAllow = 1000 / 8;
		this.moveTimeStamp = Date.now();

		this.content.style.backgroundColor = '#353535';
		window.addEventListener('resize', this.resize.bind(this));

		this.joystickContainer = document.createElement('div');
		this.content.appendChild(this.joystickContainer);


		this.content.addEventListener("touchstart", this.handleStart.bind(this), false);
		this.content.addEventListener("touchend", this.handleEnd.bind(this), false);
		this.content.addEventListener("touchmove", this.handleMove.bind(this), false);

		this.joystick = document.createElement('img');
		this.joystick.src = './applications/Gamepad/images/joystick.png';
		this.joystick.style.position = 'absolute';
		this.content.appendChild(this.joystick);

		this.BtnA = document.createElement('img');
		this.BtnA.src = './applications/Gamepad/images/a.png';
		this.BtnA.style.position = 'absolute';
		this.content.appendChild(this.BtnA);

		this.BtnB = document.createElement('img');
		this.BtnB.src = './applications/Gamepad/images/b.png';
		this.BtnB.style.position = 'absolute';
		this.content.appendChild(this.BtnB);

		this.btns = {
			joystick: {
				x: 0,
				y: 0,
				r: window.innerHeight / 3 // px
			},
			A: {
				x: 0,
				y: 0,
				r: window.innerHeight / 4 // px
			},
			B: {
				x: 0,
				y: 0,
				r: window.innerHeight / 4 // px
			},
		};

		this.width = 0;
		this.height = 0;
		this.resize()
	}

	// event
	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.joystick.style.height =
			this.joystick.style.width = `${(this.btns.joystick.r * 2).toString()}px`;
		this.joystick.style.left = `${(this.width / 4 - this.btns.joystick.r).toString()}px`;
		this.joystick.style.top = `${(this.height / 2 - this.btns.joystick.r).toString()}px`;
		this.btns.joystick.x = this.width / 4;
		this.btns.joystick.y = this.height / 2;
		//log(this.joystick.style);

		this.BtnA.style.width =
			this.BtnA.style.height =
				this.BtnB.style.width =
					this.BtnB.style.height = `${(this.btns.A.r * 2).toString()}px`;

		this.BtnA.style.left = `${(this.width * .625 - this.btns.A.r).toString()}px`;
		this.BtnA.style.top = `${(this.height * .75 - this.btns.A.r).toString()}px`;
		this.btns.A.x = this.width * .625;
		this.btns.A.y = this.height * .75;

		this.BtnB.style.left = `${(this.width * .875 - this.btns.B.r).toString()}px`;
		this.BtnB.style.top = `${(this.height * .25 - this.btns.B.r).toString()}px`;
		this.btns.B.x = this.width * .875;
		this.btns.B.y = this.height * .25;
	}

	// check if in button
	isInButton(x, y, button) {
		//(x - x0)^2 + (y - y0)^2 <= R^2
		//где x и y - координаты вашей точки, x0 и y0 - координаты центра окружности, R - радиус
		//log(Math.sqrt((((x - button.x) * (x - button.x)) + ((y - button.y) * (y - button.y)))));
		return ((((x - button.x) * (x - button.x)) + ((y - button.y) * (y - button.y))) <= (button.r * button.r))
	}

	// touch events
	handleStart(e) {
		for (let i = 0; i < e.touches.length; i++) {
			let touch = e.touches[i];
			if (this.isInButton(touch.pageX, touch.pageY, this.btns.A)) {
				this.cloudInterface.message({
					type: EnumMessage.ButtonClick,
					value: 'A'
				});
			}
			if (this.isInButton(touch.pageX, touch.pageY, this.btns.B)) {
				this.cloudInterface.message({
					type: EnumMessage.ButtonClick,
					value: 'B'
				});
			}
			if (this.isInButton(touch.pageX, touch.pageY, this.btns.joystick)) {
				this.sendMove(touch.pageX - this.btns.joystick.x, touch.pageY - this.btns.joystick.y);
			}
		}
	}

	handleEnd(e) {
		this.cloudInterface.message({
			type: EnumMessage.StopFigure,
		});
	}

	sendMove(hor, ver) {
		let now = Date.now();
		if (now - this.moveTimeStamp > this.moveDtAllow) {
			this.moveTimeStamp = now;
			// проверка на время, не отправлять чаще чем Н раз в сек
			this.cloudInterface.message({
				type: EnumMessage.MoveFigure,
				x: ver,
				z: -hor,
			});
		}
	}

	handleMove(e) {
		for (let i = 0; i < e.touches.length; i++) {
			let touch = e.touches[i];
			if (this.isInButton(touch.pageX, touch.pageY, this.btns.joystick)) {
				this.sendMove(touch.pageX - this.btns.joystick.x, touch.pageY - this.btns.joystick.y);
			}
		}
	}

}

export {Gamepad};
