function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')
    ;
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function subscribeToPushNotifications(registration) {
    if ('pushManager' in registration) {
        const options = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'),
        };

        const status = await pushStatus;

        if (status) {
            try {
                const subscription = await registration.pushManager.subscribe(options);
                //Received subscription
                return subscription
            } catch (e) {
                return console.error('Push registration failed', e);
            }
        }
    }
    return console.error('Push registration failed')
}

export async function registerServiceWorker() {
    try {
        const swFilename = './sw.js'
        const registration = await navigator.serviceWorker.register(swFilename);
        return subscribeToPushNotifications(registration);
    } catch (e) {
        return console.error('ServiceWorker failed', e);
    }
}

const pushStatus = new Promise((resolve, reject) => {
    return Notification.requestPermission(result => {
        const el = document.createElement('div');
        el.classList.add('push-info');
    
        if (result !== 'granted') {
            el.classList.add('inactive');
            el.textContent = 'Push blocked';
        } else {
            el.classList.add('active');
            el.textContent = 'Push active';
        }
        document.body.appendChild(el)
        return result
    })
});
