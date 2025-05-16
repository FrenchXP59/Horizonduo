module.exports = {
  globDirectory: "build/",
  globPatterns: [
    "**/*.{html,js,css,webp,png,svg,json}"
  ],
  swDest: "build/service-worker.js",
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: { maxEntries: 50, maxAgeSeconds: 30*24*60*60 },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
      },
    },
    {
      urlPattern: /.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "others",
      },
    },
  ],
};