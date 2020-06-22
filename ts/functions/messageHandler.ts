import MessageHandlers from '../objects/MessageHandlers';

export default function messageHandler(event: MessageEvent) {
	if (typeof event.data === 'object' && event.data !== null && typeof event.data.type === 'string') {
		if (typeof MessageHandlers[event.data.type] === 'function') {
			MessageHandlers[event.data.type](event);
		} else {
			console.error('Unknown message type from service worker: ' + event.data.type);
		}
	}
}