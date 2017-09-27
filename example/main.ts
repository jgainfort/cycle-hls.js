import { run } from '@cycle/run'
import xs, { Stream } from 'xstream'
import { makeHlsjsDriver } from '../src'
import * as Hls from 'hls.js'

interface Sources {
  Hls: any
}

function main(sources: Sources) {
  const hlsSource = sources.Hls
  const hls = hlsSource.init(0, 'video', 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8')

  return {
    Hls: hls
  }
}

const drivers = {
  Hls: makeHlsjsDriver()
}

run(main, drivers)
