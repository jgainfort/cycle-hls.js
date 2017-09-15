import { expect } from 'chai'
import { makeHlsjsDriver } from './hlsjs-driver'

describe('makeHlsDriver function', () => {
  it('should return a function', () => {
    const driver = makeHlsjsDriver()
    expect(driver).to.be.a('function')
  })

  it('should return a function that returns a string with provided id', () => {
    const driver = makeHlsjsDriver()
    const result = driver('hls.js')
    expect(result).equal('Hello hls.js')
  })
})
