const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const config = require('./config.json');

module.exports = {
  context: path.resolve(__dirname, './app'),
  entry: {
    R: './index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]-[chunkhash].js',
  },

  plugins: [
    new SWPrecacheWebpackPlugin({
      cacheId: 'dehors',
      filename: 'service-worker.js',
      maximumFileSizeToCacheInBytes: 1024 * 1024,
      minify: false,
      ignoreUrlParametersMatching: [/^launcher/],
      staticFileGlobs: [
        'dist/index.html',
        'dist/index.html?launcher=true',
        'dist/R.js',
        'dist/*.png',
        'dist/*.ico',
        'dist/*.svg',
        'dist/manifest.json',
      ],
      stripPrefix: 'dist',
      runtimeCaching: [
        {
          handler: 'cacheFirst',
          urlPattern: /^https:\/\/(maxcdn|cdn|fonts)/,
        },
        {
          handler: 'networkFirst',
          urlPattern: /(maps\.googleapis|api\.waqi\.info)/,
        },
      ],
    }),

    new HtmlWebpackPlugin({
      hash: false,
      filename: 'index.html',
      template: __dirname + '/public/index.ejs',
      excludeChunks: ['sw'],
    }),

    new webpack.DefinePlugin({
      __CONFIG__: JSON.stringify(config),
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /localforage|lodash/,
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'less-loader',
        ],
      },
    ],
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: path.resolve(__dirname, './public'),
  },
};
