module.exports = {
  plugins: [
    { plugin: require('craco-plugin-react-hot-reload') },
    { plugin: require('craco-cesium')() },
  ],
  babel: {
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
  },
}
