export default function setUpChannel(messageHandler) {
	const Channel = new MessageChannel();
	Channel.port1.start();
	Channel.port2.start();

	Channel.port1.addEventListener('message', messageHandler);

	navigator.serviceWorker.controller.postMessage({ type: 'registerChannel' }, [Channel.port2]);
}