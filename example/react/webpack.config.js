var path = require('path');

module.exports = {
  devtool: 'eval',
  context: __dirname,
  entry: {
    application: [ './startup.js' ]
  },
  resolve: {
    alias: {
      'redux-ish': path.resolve(__dirname, '../../src')
    }
  },
  module: {
    loaders: [
      { test: /\.jsx?/, loader: 'babel' }
    ]
  }
};