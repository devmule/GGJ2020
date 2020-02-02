import {EnumKeyboard, EnumShapes} from "./libs/Enums.js";

const CSettings = {
	timeForPeace: 5, // время перемирия
	timeForRound: 20,// время раунда в секундах
	worldDestroyBegins: 5, // время с которого начинается разрушение
	minPlayers: 2,
	spawnRadius: 10,
};

function getSettingVal(setting) {
	// [min, max, max_steps, cur_step]
	return setting[0] + (setting[1] - setting[0]) * setting[3];
}

const EnumSettings = {};
EnumSettings.FrictionRestitution = 0;
EnumSettings.MassCoeff = 1;
EnumSettings.MaxSpeed = 2;
EnumSettings.ForceCoeff = 3;

// todo coefs
const EnumForceCoeff = {};
const EnumMassCoeff = {};

class Controller {
	constructor(view, app) {
		this.app = app;

		this.scene = view.scene;
		this.camera = view.camera;

		this.IS_GAME = false;
		this.GAME_TIME = 0;

		// [min, max, max_steps, cur_step]
		this.WORLD_SETTINGS = {};
		this.WORLD_SETTINGS[EnumSettings.FrictionRestitution] = [0, 1, 10, 10];
		this.WORLD_SETTINGS[EnumSettings.MassCoeff] = [.5, 1.5, 10, 5];
		this.WORLD_SETTINGS[EnumSettings.MaxSpeed] = [.5, 1.5, 10, 5];
		this.WORLD_SETTINGS[EnumSettings.ForceCoeff] = [.5, 1.5, 10, 5];

		this.camera.position.set(20, 45, 0);
		this.camera.lookAt(this.scene.position);

		// Ground
		// todo делать точки спавна
		// todo разрушаемый мир
		this.ground = [];
		this.groundIndex = 0;

		let boxSize = 5;
		let cornerCount = 11;

		for (let i = 0; i < cornerCount; i++) {
			for (let j = 0; j < cornerCount; j++) {
				let geo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
				let ground = new Physijs.BoxMesh(
					geo,
					Physijs.createMaterial(
						new THREE.MeshLambertMaterial(),
						1,
						0
					),
					0 // mass
				);
				ground.position.set(
					i * boxSize - boxSize / 2 - boxSize * cornerCount / 2,
					0,
					j * boxSize - boxSize / 2 - boxSize * cornerCount / 2,
				);
				ground.userData.position = new THREE.Vector3().copy(ground.position);
				this.scene.add(ground);
				this.ground.push(ground)
			}
		}
		this.ground.sort((a, b) => {
			return b.position.distanceTo({x: 0, y: 0, z: 0}) - a.position.distanceTo({x: 0, y: 0, z: 0});
		});
		/*this.ground = new Physijs.BoxMesh(
			geo,
			Physijs.createMaterial(
				new THREE.MeshLambertMaterial(),
				1,
				0
			),
			0 // mass
		);
		//ground.rotation.x = Math.PI / -2;
		this.ground.scale.x = this.ground.scale.y = this.ground.scale.z = 1;
		this.ground.receiveShadow = true;
		this.scene.add(this.ground);
		log(this.ground);
		//this.ground.mass = 100;*/

		this.controlled = null;
		this.boxes = [];

		this.failurePriority = [];

		this.geometries = {};
		this.geometries[EnumShapes.Box] = new THREE.BoxGeometry(3, 3, 3);
		this.geometries[EnumShapes.Sphere] = new THREE.SphereGeometry(1.5, 32, 32);
		this.geometries[EnumShapes.Tetraedron] = new THREE.TetrahedronGeometry(2);
	}

	tick(dt) {
		// return;
		this.GAME_TIME -= dt / 1000;
		this.app.UI.time = Math.max(this.GAME_TIME, 0);
		if (!this.IS_GAME) {
			if (this.GAME_TIME < 0) this.startRoundIfCan();
		} else {

			if (CSettings.timeForRound - this.GAME_TIME >= CSettings.worldDestroyBegins) {
				let currentID = Math.round((CSettings.timeForRound - this.GAME_TIME - CSettings.worldDestroyBegins) /
					(CSettings.timeForRound - CSettings.worldDestroyBegins) * this.ground.length);
				for (let i = this.groundIndex; i < currentID + 1; i++)
					if (this.ground[i]) this.ground[i].mass = 100;
				this.groundIndex = currentID;
			}

			for (let key in this.app.players)
				if (this.app.players.hasOwnProperty(key)) {
					let player = this.app.players[key];

					if (player.inGame && player.figure) {
						// сдвинуть
						this.moveFigure(player.figure, player.acceleration);
						// прыгнуть
						if (player.jump) {
							if (player.figure._physijs.touches.length > 0)
								this.moveFigure(player.figure, {y: 10});
							player.jump = false;
						}
						// юзануть форс, Люк
						if (player.force) {
							this.aplyForce(player.figure);
							player.force = false;
						}
						// проверить не упал ли игрок
						if (player.figure.position.y < 0) {
							player.inGame = false;
							this.failurePriority.push(player);
							// todo переделать условия выдачи апгрейдов
							this.app.UI.updateUserList();
							log('update');
							this.app.sendUpdateRequest(player);
							this.endRoundIfCan();
						}
						// todo speed
						let speed = new THREE.Vector3().copy(player.figure._physijs.linearVelocity);
						speed.clampLength(0, getSettingVal(this.WORLD_SETTINGS[EnumSettings.MaxSpeed]));
						player.figure.setLinearVelocity(speed);
					}
				}
		}
	}

	// GAME RUNTIME
	startRoundIfCan() {
		if (Object.keys(this.app.players).length < CSettings.minPlayers) return;
		if (this.IS_GAME) return;

		this.startRound();
	}

	startRound() {
		this.IS_GAME = true;
		this.GAME_TIME = CSettings.timeForRound;

		// сегмент в градусах
		let curAngle = 0, segment = 2 * Math.PI / Object.keys(this.app.players).length;

		for (let key in this.app.players)
			if (this.app.players.hasOwnProperty(key)) {
				let player = this.app.players[key];
				// обнуляем игровые параметры
				player.inGame = true;
				player.jump = player.force = false;
				player.acceleration = {x: 0, y: 0, z: 0};

				// ставим фигуру в сцену, если нужно
				if (!player.figure.parent)
					this.scene.add(player.figure);

				//player.figure.attributes.position.needsUpdate = true;
				player.figure.__dirtyPosition = true;
				player.figure.position.set(
					Math.sin(curAngle) * CSettings.spawnRadius,
					10,
					-1 * Math.cos(curAngle) * CSettings.spawnRadius,
				);
				player.figure._physijs.position.x = Math.sin(curAngle) * CSettings.spawnRadius;
				player.figure._physijs.position.y = 10;
				player.figure._physijs.position.z = -1 * Math.cos(curAngle) * CSettings.spawnRadius;
				player.figure.rotation.set(0, 0, 0);
				player.figure.setLinearVelocity(new THREE.Vector3(0, 0, 0));
				player.figure.setAngularVelocity(new THREE.Vector3(0, 0, 0));
				//player.figure._physijs.position.copy(player.figure.position);
				curAngle += segment;
				log(player.figure.position)
			}

		// todo apply settings
		// friction restitution


		// todo динамичная доска

		this.app.UI.updateUserList();
	}

	endRoundIfCan() {
		for (let key in this.app.players)
			if (this.app.players.hasOwnProperty(key)) if (this.app.players[key].inGame) return;

		this.endRound();
	}

	endRound() {
		for (let key in this.app.players)
			if (this.app.players.hasOwnProperty(key)) {
				let player = this.app.players[key];
			}

		this.IS_GAME = false;
		this.GAME_TIME = CSettings.timeForPeace;
		if (this.failurePriority.length > 0) {
			let winner = this.failurePriority[this.failurePriority.length - 1];
			winner.wins += 1;
		}

		this.failurePriority = [];
		this.app.UI.updateUserList();
		this.groundIndex = 0;
		for (let i = 0; i < this.ground.length; i++) {
			let ground = this.ground[i];
			ground.__dirtyPosition = true;
			ground.mass = 0;
			ground.position.set(
				ground.userData.position.x,
				ground.userData.position.y,
				ground.userData.position.z,
			);
			ground.setLinearVelocity(new THREE.Vector3(0, 0, 0));
			ground.setAngularVelocity(new THREE.Vector3(0, 0, 0));
			ground._physijs.position.x = ground.userData.position.x;
			ground._physijs.position.y = ground.userData.position.y;
			ground._physijs.position.z = ground.userData.position.z;

			ground._physijs.rotation.x = ground._physijs.rotation.y = ground._physijs.rotation.z = 0;
			ground._physijs.rotation.w = 1;
		}
	}

	// FUNCS
	createShape(shapeType) {
		let shape, material = new THREE.MeshLambertMaterial({opacity: 1, transparent: false});

		switch (shapeType) {
			case EnumShapes.Sphere:
				shape = new Physijs.SphereMesh(
					this.geometries[EnumShapes.Sphere],
					material,
					undefined,
					{restitution: Math.random() * 1.5}
				);
				shape.userData.shape = EnumShapes.Sphere;
				break;

			case EnumShapes.Tetraedron:
				shape = new Physijs.ConvexMesh(
					this.geometries[EnumShapes.Tetraedron],
					material,
				);
				shape.userData.shape = EnumShapes.Tetraedron;
				break;

			default :/*EnumShapes.Box*/
				shape = new Physijs.BoxMesh(
					this.geometries[EnumShapes.Box],
					material
				);
				shape.userData.shape = EnumShapes.Box;
				break;
		}

		shape.material.color.setRGB(Math.random(), Math.random(), Math.random());
		shape.castShadow = true;
		shape.receiveShadow = true;

		shape.rotation.set(
			Math.random() * Math.PI,
			Math.random() * Math.PI,
			Math.random() * Math.PI
		);
		// this.scene.add(shape);
		return shape;
	}

	moveFigure(figure, dir) {
		figure.setLinearVelocity({
			x: figure._physijs.linearVelocity.x += (dir.x || 0),
			y: figure._physijs.linearVelocity.y += (dir.y || 0),
			z: figure._physijs.linearVelocity.z += (dir.z || 0),
		});
	}

	aplyForce(object) {
		// todo проверить не всегда срабатывает
		let pos = object.position.clone();

		if (!pos) return;
		let strength = 1000, distance, effect, offset, box;

		for (let key in this.app.players)
			if (this.app.players.hasOwnProperty(key)) {
				box = this.app.players[key].figure;
				if (box && box !== object) {
					distance = pos.distanceTo(box.position);
					effect = pos.clone().sub(box.position).normalize().multiplyScalar(strength / distance).negate();
					offset = pos.clone().sub(box.position);
					box.applyImpulse(effect, offset);
				}
			}
	}
}

export {Controller, EnumSettings}
