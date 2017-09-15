import { adapt } from '@cycle/run/lib/adapt'
import xs from 'xstream'
import * as Hls from 'hls.js'

export function makeHlsjsDriver(id: string, config?: Hls.OptionalConfig) {
  if (!Hls.isSupported()) {
    throw new Error('MSE not supported in your browser')
  }

  const video = document.getElementById(id) as HTMLVideoElement
  const hls = new Hls(config)

  function hlsjsDriver(sink$) {
    const source = xs.create()

    return adapt(source)
  }

  return hlsjsDriver
}
