'use strict'

process.env.NODE_ENV = 'production'

const chalk = require('chalk')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')
const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const fs = require('fs-extra')
const path = require('path')
const webpack = require('webpack')

const buildPath = path.join(process.cwd(), 'dist')
const config = require(path.join(process.cwd(), 'configs/webpack.config.prod'))

measureFileSizesBeforeBuild(buildPath)
  .then(prevFileSizes => {
    fs.emptyDirSync(buildPath)
    build(prevFileSizes)
  })

function printErrors(summary, errors) {
  console.log(chalk.red(summary))
  console.log()
  errors.forEach(err => {
    console.log(err.message || err)
    console.log()
  })
}

function build(prevFileSizes) {
  console.log('Creating an optimized production build ...')

  let compiler
  try {
    compiler = webpack(config)
  } catch (err) {
    printErrors('Failed to compile.', [err])
    process.exit(1)
  }

  compiler.run((err, stats) => {
    if (err) {
      printErrors('Failed to compile.', [err])
      process.exit(1)
    }

    if (stats.compilation.errors.length) {
      printErrors('Failed to compile.', stats.compilation.errors)
      process.exit(1)
    }

    if (process.env.CI && stats.compilation.warnings.length) {
      printErrors(
        'Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically',
        stats.compilation.warnings
      )
      process.exit(1)
    }

    console.log(chalk.green('Compiled successfully.'))
    console.log()

    console.log()
  })
}
