// client-seitiges JS zur Registrierung für Push-Notifications
// Hard-coded
const publicVapidKey = 'BDNQ5ykg5NuEzItlBUjSg94BgwYak5rmnLbVY3NEUaqxRGjhhoRuveu7ppyae5vGqpbtgHb6euVF48ktmDOaPY4';

// Check, ob ServiceWorker durch den Browser unterstützt werden
if ('serviceWorker' in navigator) {

    console.log('Registering to push-notifications');

    run().catch(error => console.error(error));
}

async function run() {
    console.log('Registering service worker');
    navigator.serviceWorker.register('/worker.js')
    .then(function(registration){
        console.log('Subscribing to push');
        registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicVapidKey
        })
        .then(function(subscription) {
            console.log('Sending push to register permanently and confirm');
            fetch('http://192.168.178.24:3000/subscribe', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                'content-type': 'application/json'
                }  
            })
        })
    });
  console.log('Sent push. Registration complete.');
}