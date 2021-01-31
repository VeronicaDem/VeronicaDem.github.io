
if (('serviceWorker' in navigator) && (window.location.protocol != "file:")) {
    if (navigator.serviceWorker.controller) {
        console.log('App Service worker found');
    } else {
        navigator.serviceWorker.register('service-worker.js', {
            scope: './'
        }).then(function(reg) {
            console.log('App Service worker registered for scope:' + reg.scope);
        });
    }
}