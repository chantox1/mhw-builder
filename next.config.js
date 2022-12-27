// next.config.js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  images: {
    loader: 'akamai',
    path: '',
  },
}