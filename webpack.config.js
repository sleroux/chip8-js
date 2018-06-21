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
    globalObject: 'this', 
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: [/\.js$/, /\.jsx$/],
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
      },
      {
        test: /\.(png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000, // 8kb limit
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]

      }
    ],
  },
  devtool: 'source-map',
  plugins: [HTMLWebpackPluginConfig]
};
