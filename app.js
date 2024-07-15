if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
  
          navigator.serviceWorker.addEventListener('message', event => {
            if (event.data.type === 'CACHE_UPDATED') {
              window.location.reload();
            } else if (event.data.type === 'CACHE_REFRESHED') {
              console.log(event.data.message);
              window.location.reload();
            }
          });
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
  
  document.addEventListener('keydown', event => {
    if (event.ctrlKey && event.altKey && event.key === 'r') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ action: 'refreshCache' });
        deleteAllCookies();
      }
    }
  });
  
  function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}