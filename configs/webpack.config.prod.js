'use strict'

// Silence webpack2 deprecation warnings
// https://github.com/vuejs/vue-loader/issues/666
process.noDeprecation = true

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { CheckerPlugin } = require('awesome-typescript-loader')

// Paths to be used for webpack configuration
const paths = {
  appSrc: path.join(process.cwd(), 'src'),
  appIndex: path.join(process.cwd(), 'src', 'index.ts'),
  appBuild: path.join(process.cwd(), 'dist'),
  public: '/'
}

module.exports = {
  entry: {
    main: [
      // Your app's code
      paths.appIndex
    ]
  },
  output: {
    // This is the productin JS bundle containing code from all our entry points.
    filename: 'cycle-hlsjs.js',
    // The output path where webpack will write the bundle
    path: paths.appBuild
  },
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    // Makes environment variables available to the JS code, fallback to 'production'
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production')
    }),
    // Uglify plugin, depending on the devtool options, Source Maps are generated.
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: this.devtool && this.devtool.indexOf('source-map') >= 0
    })
  ],
  devtool: 'cheap-module-source-map'
}
