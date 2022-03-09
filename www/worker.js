console.log('Loaded service worker!');

self.addEventListener('push', ev => {
  console.log(ev.data.json());
  const data = ev.data.json();
  console.log('Got push', data);
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'parking.png'
  });
});