const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  target: 'web',
  cache: false,
  debug: false,
  devtool: false,
  entry: {
    app: ['webpack-hot-middleware/client?reload=true', path.resolve(__dirname, '../../../src/client/app.jsx')],
    loginForm: ['webpack-hot-middleware/client?reload=true', path.resolve(__dirname, '../../../src/client/component/LoginForm.jsx')],
    accessDialog: ['webpack-hot-middleware/client?reload=true', path.resolve(__dirname, '../../../src/client/component/AccessDialog.jsx')]
  },
  output: {
    path: path.resolve(__dirname, '../../server/public'),
    filename: 'js/[name].js'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    new ExtractTextPlugin('css/main.css'),
    new ExtractTextPlugin('css/login.css'),
    new ExtractTextPlugin('css/accessDialog.css')
  ],
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: ['babel-loader'],
        exclude: /node_modules\//
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css-loader!sass-loader')
      }
    ]
  },
  sassLoader: {
    outputStyle: 'compressed'
  },
  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx'
    ]
  }
};
