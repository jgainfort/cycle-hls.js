'use strict'

const path = require('path')
const spawn = require('cross-spawn')
const chalk = require('chalk')

const mocha = path.resolve(process.cwd(), 'node_modules', '.bin', 'mocha')

const args = [
  '--colors',
  '--reporter',
  'spec',
  '--compilers',
  'ts:ts-node/register',
  'src/**/*.spec.ts'
].filter(Boolean)

spawn(mocha, args, { stdio: 'inherit' })
