'use strict'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const host = 'http://localhost'
const port = 8000

const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    `webpack-dev-server/client?${host}:${port.toString()}`,
    'webpack/hot/dev-server',
    './example/main.ts'
  ],
  output: {
    filename: 'bundle.js',
    path: '/'
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
    new webpack.HotModuleReplacementPlugin(),
    new ProgressBarPlugin()
  ]
}

const compiler = webpack(config)
compiler.plugin('done', () => {
  console.log(`App is running at ${host}:${port}`)
})
const server = new WebpackDevServer(compiler, {
  historyApiFallback: true,
  hot: true,
  contentBase: './example',
  stats: 'errors-only'
})
server.listen(port)
