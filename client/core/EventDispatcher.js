class DispatcherEvent {
	constructor(eventName) {
		this.eventName = eventName;
		this.callbacks = [];
	}

	registerCallback(callback) {
		this.callbacks.push(callback);
	}

	unregisterCallback(callback) {
		const index = this.callbacks.indexOf(callback);
		if (index > -1) {
			this.callbacks.splice(index, 1);
		}
	}

	fire(data) {
		const callbacks = this.callbacks.slice(0);
		callbacks.forEach((callback) => {
			callback(data);
		});
	}
}

class EventDispatcher {
	constructor() {
		this.events = {};
	}

	dispatchEvent(eventName, data) {
		const event = this.events[eventName];
		if (event) {
			event.fire(data);
		}
	}

	addEventListener(eventName, callback) {
		let event = this.events[eventName];
		if (!event) {
			event = new DispatcherEvent(eventName);
			this.events[eventName] = event;
		}
		event.registerCallback(callback);
	}

	removeEventListener(eventName, callback) {
		const event = this.events[eventName];
		if (event && event.callbacks.indexOf(callback) > -1) {
			event.unregisterCallback(callback);
			if (event.callbacks.length === 0) {
				delete this.events[eventName];
			}
		}
	}
}

export {EventDispatcher}
