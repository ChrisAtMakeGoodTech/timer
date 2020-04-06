export default function setupNotifications() {
	if (Notification.permission !== 'granted') {
		requestPermission();
	}
}

async function requestPermission() {
	const Permission = await Notification.requestPermission();
	if (Permission !== 'granted') {
		alert('You will not receive notifications about work periods ending.');
	}
}