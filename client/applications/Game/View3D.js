class TView3D {
	constructor() {
		// camera
		this.aspect = window.innerWidth / window.innerHeight;
		this.near = .1;
		this.far = 1000;
		this.fov = 75; // поле зрения по вертикали в градусах

		// rendering
		this.pixelRatio = 1;  // px per real screen pixel
		this.antialias = true;

		// scene
		this.background = new THREE.Color(0xefefef);
	}
}

class View3D {
	constructor(type) {
		this.type = type;

		window.addEventListener('resize', this.resize.bind(this));

		this.scene = new Physijs.Scene();
		this.scene.background = type.background;
		log(type.background);
		this.camera = new THREE.PerspectiveCamera(type.fov, type.aspect, type.near, type.far);
		this.renderer = new THREE.WebGLRenderer({antialias: type.antialias, /*alpha: true*/});
		this.renderer.setPixelRatio(this.type.pixelRatio);
		this.camera.position.z = 5;

		let ambient = new THREE.AmbientLight(0x404040); // soft white light
		this.scene.add(ambient);

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

		this.resize();
	}

	resize() {
		let w = window.innerWidth;
		let h = window.innerHeight;
		this.renderer.setSize(w, h);
		this.camera.setViewOffset(w, h, 0, 0, w, h);
	}
}

export {View3D, TView3D}
