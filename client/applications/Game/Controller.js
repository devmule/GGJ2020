import {EnumKeyboard} from "./libs/Enums.js";

class Controller {
	constructor(view) {
		this.scene = view.scene;
		this.camera = view.camera;


		this.camera.position.set(30, 30, 30);
		this.camera.lookAt(this.scene.position);

		document.addEventListener(EnumKeyboard.KEY_DOWN, this.keyDown.bind(this));

		{// Light and ground
			var light1 = new THREE.AmbientLight(0x404040); // soft white light
			this.scene.add(light1);

			let light = new THREE.DirectionalLight(0xFFFFFF);
			light.position.set(20, 40, -15);
			light.target.position.copy(this.scene.position);
			light.castShadow = true;
			light.shadow.camera.left = -60;
			light.shadow.camera.top = -60;
			light.shadow.camera.right = 60;
			light.shadow.camera.bottom = 60;
			light.shadow.camera.near = 20;
			light.shadow.camera.far = 200;
			light.shadow.bias = -.0001;
			//light.shadow.map.width = light.shadow.map.height = 2048;
			this.scene.add(light);

			// Ground
			let geo = new THREE.BoxGeometry(100, 1, 100);
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
			ground.scale.x = ground.scale.y = ground.scale.z = .5;
			ground.receiveShadow = true;
			this.scene.add(ground);
		}

		this.controlled = null;
		this.boxes = [];
	}

	createShape() {
		let box_geometry = new THREE.BoxGeometry(3, 3, 3);
		let shape, material = new THREE.MeshLambertMaterial({opacity: 1, transparent: false});

		shape = new Physijs.BoxMesh(
			box_geometry,
			Physijs.createMaterial(
				material,
				1,
				0
			),
		);

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
		this.scene.add(shape);
		return shape;
	}

	aplyForce() {
		let pos = this.controlled.position.clone();

		if (!pos) return;
		log(pos);
		let strength = 1000, distance, effect, offset, box;

		for (let i = 0; i < this.boxes.length; i++) {
			box = this.boxes[i];
			if (box !== this.controlled) {
				distance = pos.distanceTo(box.position);
				effect = pos.clone().sub(box.position).normalize().multiplyScalar(strength / distance).negate();
				offset = pos.clone().sub(box.position);
				box.applyImpulse(effect, offset);
			}
		}
	}

	keyDown(e) {
		log(e);
		if (e.keyCode === EnumKeyboard.KeyP) {
			this.controlled = this.createShape();
			this.boxes.push(this.controlled);
		}
		if (this.controlled) {
			if (e.keyCode === EnumKeyboard.KeyS) {
				this.controlled.setLinearVelocity({
					x: this.controlled._physijs.linearVelocity.x += 10,
					y: this.controlled._physijs.linearVelocity.y,
					z: this.controlled._physijs.linearVelocity.z
				});
			} else if (e.keyCode === EnumKeyboard.KeyW) {
				this.controlled.setLinearVelocity({
					x: this.controlled._physijs.linearVelocity.x -= 10,
					y: this.controlled._physijs.linearVelocity.y,
					z: this.controlled._physijs.linearVelocity.z
				});
			} else if (e.keyCode === EnumKeyboard.KeyA) {
				this.controlled.setLinearVelocity({
					x: this.controlled._physijs.linearVelocity.x,
					y: this.controlled._physijs.linearVelocity.y,
					z: this.controlled._physijs.linearVelocity.z += 10
				});
			} else if (e.keyCode === EnumKeyboard.KeyD) {
				this.controlled.setLinearVelocity({
					x: this.controlled._physijs.linearVelocity.x,
					y: this.controlled._physijs.linearVelocity.y,
					z: this.controlled._physijs.linearVelocity.z -= 10
				});
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

	keyUp(e) {
	}
}

export {Controller}
