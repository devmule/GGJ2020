import {EnumKeyboard, EnumShapes} from "./libs/Enums.js";

class Controller {
	constructor(view, app) {
		this.app = app;

		this.scene = view.scene;
		this.camera = view.camera;


		this.camera.position.set(35, 30, 0);
		this.camera.lookAt(this.scene.position);

		document.addEventListener(EnumKeyboard.KEY_DOWN, this.keyDown.bind(this));

		// Ground
		// todo делать точки спавна
		// todo разрушаемый мир
		let geo = new THREE.BoxGeometry(50, 5, 50);
		let ground = new Physijs.BoxMesh(
			geo,
			Physijs.createMaterial(
				new THREE.MeshLambertMaterial(),
				1,
				0
			),
			0 // mass
		);
		//ground.rotation.x = Math.PI / -2;
		ground.scale.x = ground.scale.y = ground.scale.z = 1;
		ground.receiveShadow = true;
		this.scene.add(ground);

		this.controlled = null;
		this.boxes = [];

		this.geometries = {};
		this.geometries[EnumShapes.Box] = new THREE.BoxGeometry(3, 3, 3);
		this.geometries[EnumShapes.Sphere] = new THREE.SphereGeometry(1.5, 32, 32);
		this.geometries[EnumShapes.Tetraedron] = new THREE.TetrahedronGeometry(2);
	}

	tick(dt) {
		for (let key in this.app.players)
			if (this.app.players.hasOwnProperty(key)) {
				let player = this.app.players[key];
				// todo check сли игрок проиграл
				if (player.figure) {
					this.moveFigure(player.figure, player.acceleration);
					if (player.jump) {
						this.moveFigure(player.figure, {y: 10});
						player.jump = false;
					}
					if (player.force) {
						log(player.object);
						this.aplyForce(player.figure);
						player.force = false;
					}
				}
			}
	}


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
				break;

			case EnumShapes.Tetraedron:
				shape = new Physijs.ConvexMesh(
					this.geometries[EnumShapes.Tetraedron],
					material,
				);
				break;

			default :/*EnumShapes.Box*/
				shape = new Physijs.BoxMesh(
					this.geometries[EnumShapes.Box],
					material
				);
				break;
		}

		shape.position.set(
			Math.random() * 10 - 5,
			10,
			Math.random() * 10 - 5
		);

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
		let pos = object.position.clone();

		if (!pos) return;
		log(pos);
		let strength = 1000, distance, effect, offset, box;

		for (let key in this.app.players)
			if (this.app.players.hasOwnProperty(key)) {
				let box = this.app.players[key].figure;
				if (box && box !== object) {
					distance = pos.distanceTo(box.position);
					effect = pos.clone().sub(box.position).normalize().multiplyScalar(strength / distance).negate();
					offset = pos.clone().sub(box.position);
					box.applyImpulse(effect, offset);
				}
			}
	}

	keyDown(e) {
		return;
		//log(e);
		if (e.keyCode === EnumKeyboard.KeyP) {
			this.controlled = this.createShape(EnumShapes.Tetraedron);
			this.boxes.push(this.controlled);
		}
		if (this.controlled) {
			if (e.keyCode === EnumKeyboard.KeyS) {
				this.moveFigure(this.controlled, {x: 10});
			} else if (e.keyCode === EnumKeyboard.KeyW) {
				this.moveFigure(this.controlled, {x: -10});
			} else if (e.keyCode === EnumKeyboard.KeyA) {
				this.moveFigure(this.controlled, {z: 10});
			} else if (e.keyCode === EnumKeyboard.KeyD) {
				this.moveFigure(this.controlled, {z: -10});
			} else if (e.keyCode === EnumKeyboard.Space) {
				this.controlled.setLinearVelocity({
					x: this.controlled._physijs.linearVelocity.x,
					y: 10,
					z: this.controlled._physijs.linearVelocity.z
				});
			} else if (e.keyCode === EnumKeyboard.KeyE) {
				this.aplyForce();
			}
		}
	}
}

export {Controller}
