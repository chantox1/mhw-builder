// next.config.js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? '/mhw-builder/' : '',
  images: {
    loader: 'akamai',
    path: '/mhw-builder/',
  },
}