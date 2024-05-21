const defaultConfig = require("./config/default.json");
const productionConfig = require("./config/production.json");
const withPWA = require("next-pwa");

let config = {
  env: defaultConfig,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
};
if (process.env.NEXT_PUBLIC_NODE_ENV === "local") {
  config = {
    ...config,
    
  };
}
if (process.env.NEXT_PUBLIC_NODE_ENV === "production")
  config = {
    env: {
      ...defaultConfig,
      ...productionConfig,
    },
    reactStrictMode: false,
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
// if (process.env.NEXT_PUBLIC_NODE_ENV === "local")
  module.exports = config;
// else
// module.exports = withPWA(config);
