import { run } from '@cycle/run'
import xs, { Stream } from 'xstream'
import { makeHlsjsDriver } from '../src'
import * as Hls from 'hls.js'

interface Sources {
  Hls: any
}

function main(sources: Sources) {
  const hls$ = sources.Hls

  hls$.select(Hls.Events.MANIFEST_PARSED)
    .map(ev => console.log('hls event: ', ev))

  const sinks = {
    Hls: xs.of({
      events: [Hls.Events.MANIFEST_PARSED, Hls.Events.FRAG_BUFFERED]
    })
  }

  return sinks
}

const drivers = {
  Hls: makeHlsjsDriver('video', 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8')
}

run(main, drivers)
