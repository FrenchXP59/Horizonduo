// workbox-config.js
module.exports = {
  globDirectory: "build/",
  globPatterns: [
    "**/*.{html,js,css,webp,png,svg,json}"
  ],
  swDest: "build/service-worker.js",
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [{
    urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
    handler: "CacheFirst",
    options: {
      cacheName: "images-cache",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
      },
    },
  }, {
    urlPattern: new RegExp('^https?://fonts\\.googleapis\\.com/'),
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "google-fonts-stylesheets",
    },
  }, {
    urlPattern: new RegExp('^https?://fonts\\.gstatic\\.com/'),
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts-webfonts",
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
      },
    },
  }]
};