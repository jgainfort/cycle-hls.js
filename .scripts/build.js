'use strict'

const fs = require('fs-extra')
const path = require('path')
const mkdirp = require('mkdirp')
const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const buildPath = path.join(process.cwd(), 'build')

mkdirp.sync(buildPath)

const compiler = webpack({
  devtool: 'source-map',
  entry: [
    './src/index.ts'
  ],
  output: {
    filename: 'bundle.js',
    path: buildPath
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
})

compiler.run((err, stats) => {
  if (err) {
    console.log(err)
  }
})
