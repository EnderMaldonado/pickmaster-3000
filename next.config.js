require("dotenv").config()
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const webpack = require('webpack')
const Cookies = require('js-cookie')

const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const apiSecretKey = JSON.stringify(process.env.SHOPIFY_API_SECRET_KEY);
const shopOrigin = JSON.stringify(process.env.SHOP);

module.exports = withCSS(withSass({
  webpack: (config) => {
    const env = { API_KEY: apiKey }
    config.plugins.push(new webpack.DefinePlugin(env))

    const envS = {API_SECRET_KEY: apiSecretKey }
    config.plugins.push(new webpack.DefinePlugin(envS))

    const envShop = {SHOP_ORIGIN: shopOrigin }
    config.plugins.push(new webpack.DefinePlugin(envShop))

    config.node = {
      fs: 'empty'
    }
    return config;
  }
}));
