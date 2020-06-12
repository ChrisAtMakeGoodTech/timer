import MessageHandlers from '../objects/MessageHandlers.js';

export default function messageHandler(event: MessageEvent) {
	if (typeof event.data === 'object' && event.data !== null && typeof event.data.type === 'string') {
		// @ts-ignore
		if (typeof MessageHandlers[event.data.type] === 'function') {
			// @ts-ignore
			MessageHandlers[event.data.type](event);
		} else {
			console.error('Unknown message type from service worker: ' + event.data.type);
		}
	}
}