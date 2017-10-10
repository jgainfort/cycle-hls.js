'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const scripts = ['xstream', '@cycle/run', '@cycle/dom', '@cycle/isolate', 'cycle-onionify', 'hls.js']

module.exports = {
  devtool: 'source-map',
  entry: {
    main: ['./src/index.ts'],
    scripts: scripts
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.join(process.cwd(), 'dist')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /(node_modules)/
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      minChunks: 2,
      async: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  ]
}
