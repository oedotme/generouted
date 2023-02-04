/** @type {import('@generouted/next-js').Plugin} */
const GeneroutedNextJsPlugin = require('@generouted/next-js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, context) => {
    config.plugins.unshift(new GeneroutedNextJsPlugin())
    return config
  },
}

module.exports = nextConfig
