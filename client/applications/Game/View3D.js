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
		this.camera = new THREE.PerspectiveCamera(type.fov, type.aspect, type.near, type.far);
		this.renderer = new THREE.WebGLRenderer({antialias: type.antialias});
		this.renderer.setPixelRatio(this.type.pixelRatio);
		this.camera.position.z = 5;

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
