"use strict";
global.options = {
	"ws": {
		"port": 3001
	}
};

global.log = console.log;
global.codeLen = 3;

const CloudConsole = require('./cloudConsole');

let cloudConsole = new CloudConsole();
cloudConsole.start();
