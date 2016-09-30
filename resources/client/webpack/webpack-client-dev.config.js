const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  target: 'web',
  cache: true,
  debug: true,
  devtool: 'cheap-module-eval-source-map',
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
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('css/main.css'),
    new ExtractTextPlugin('css/login.css'),
    new ExtractTextPlugin('css/accessDialog.css')
  ],
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: ['babel-loader?cacheDirectory&presets[]=react-hmre'],
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
