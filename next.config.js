/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PRIVATE_DEBUG_CACHE: "true",
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "http://localhost",
        "https://next-geolocation.napochaan.dev",
      ],
    },
    incrementalCacheHandlerPath: require.resolve("./cache-handler.js"),
  },
};
