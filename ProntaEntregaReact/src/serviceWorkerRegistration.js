// src/serviceWorkerRegistration.js

// Este archivo se puede generar usando el comando 'npx workbox-cli generate-sw' en un proyecto vacío para obtener un template de Workbox.
// Esta es una implementación básica:

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(/127(\.[0-9]+){3}/),
);

export function register(config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    if (isLocalhost) {
      checkValidServiceWorker(swUrl, config);
    } else {
      registerValidSW(swUrl, config);
    }
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdateavailable = () => {
        if (config && config.onUpdate) {
          config.onUpdate(registration);
        }
      };
      registration.onupdatefound = () => {
        if (config && config.onSuccess) {
          config.onSuccess(registration);
        }
      };
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl)
    .then((response) => {
      if (response.status === 404 || response.type === "basic") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode.",
      );
    });
}
