import { expect } from 'chai'
import { makeHlsjsDriver } from './hlsjs-driver'

describe('makeHlsDriver function', () => {
  it('should return a function', () => {
    const driver = makeHlsjsDriver()
    expect(driver).to.be.a('function')
  })
})
