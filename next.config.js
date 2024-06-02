/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PRIVATE_DEBUG_CACHE: "true",
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "next-geolocation.napochaan.dev",
        "napochaan.dev",
        "localhost",
      ],
    },
    // incrementalCacheHandlerPath: require.resolve("./cache-handler.js"),
  },
};
