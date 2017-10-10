const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')

const scripts = ['xstream', '@cycle/run', '@cycle/dom', '@cycle/isolate', 'cycle-onionify', 'hls.js']

module.exports = {
  devtool: 'source-map',
  entry: {
    main: './src/index.ts',
    scripts: scripts
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
    publicPath: '/dist/',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  performance: {
    hints: false
  },
  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      favicon: './example/favicon.png',
      hash: true,
      inject: true,
      template: './example/index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      minChunks: 2,
      async: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}
