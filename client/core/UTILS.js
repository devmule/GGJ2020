function loadScript(url, callback) {
	let script = document.createElement("script");
	script.type = "text/javascript";
	if (script.readyState) {  // only required for IE <9
		script.onreadystatechange = function () {
			if (script.readyState === "loaded" || script.readyState === "complete") {
				script.onreadystatechange = null;
				callback();
			}
		};
	} else {
		script.onload = function () {
			callback();
		};
	}
	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

function secToMinSec(sec) {
	sec = Math.ceil(sec);
	let minutes = Math.floor(sec / 60);
	minutes.toString().length === 1 ? minutes = "0" + minutes : null;
	let seconds = sec % 60;
	seconds.toString().length === 1 ? seconds = "0" + seconds : null;
	return minutes + ":" + seconds;
}

export {loadScript, secToMinSec}
