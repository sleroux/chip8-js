var webpack = require('webpack');
var path = require('path');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + '/src/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  mode: 'development',
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      },
      {
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', options: {
              sourceMap: true
            },
          },
          {
            loader: 'sass-loader', options: {
              sourceMap: true
            }
          }
        ],
        test: /\.scss$/
      }
    ],
  },
  devtool: 'source-map',
  plugins: [HTMLWebpackPluginConfig]
};
