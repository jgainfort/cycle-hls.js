import { DOMSource, VNode, p, video, div, button, br } from '@cycle/dom'
import xs, { Stream, MemoryStream } from 'xstream'
import { StateSource } from 'cycle-onionify'
import * as Hls from 'hls.js'
import { HlsjsSource, HlsjsEvent, Config as HlsjsDriverConfig } from '../src'

export type Reducer = (prev?: State) => State | undefined

export interface State {
  id: number
}

export interface Sources {
  DOM: DOMSource,
  onion: StateSource<State>,
  hls: HlsjsSource
}

export interface Sinks {
  DOM: Stream<VNode>,
  onion: Stream<Reducer>,
  hls: Stream<HlsjsDriverConfig>
}

function getBuffer(video: HTMLVideoElement): number {
  let buffer = 0
  const currentTime = video.currentTime
  const bufferedTimeRanges = video.buffered

  let startX: number, endX: number
  for (let i = 0; i < bufferedTimeRanges.length; i++) {
    startX = bufferedTimeRanges.start(i)
    endX = bufferedTimeRanges.end(i)
    if (startX <= currentTime && currentTime <= endX) {
      buffer = Math.round(endX - currentTime)
    }
  }
  return buffer
}

function isState(val: State | HlsjsEvent): val is State {
  return (val as State).id !== undefined
}

function Video(sources: Sources): Sinks {
  const state$ = sources.onion.state$
  const element$ = sources.DOM.select('.video').elements() as MemoryStream<Element[]>
  const hls = sources.hls

  const hls$ = xs.of({
    element$: element$,
    sourceURL: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
    config: {}
  })

  const event$ = sources.hls.selectHlsEvent(element$, Hls.Events.FRAG_BUFFERED)
  const vdom$ = xs.merge(state$, event$)
    .map(val => {
      const result = { state: undefined, buffered: 0 }
      if (isState(val)) {
        result.state = val
      } else {
        result.buffered = getBuffer(val.instance.video)
      }
      return result
    })
    .map(val => {
      const videoAttrs = {
        muted: true,
        controls: true,
        autoplay: true,
        width: 640,
        height: 360
      }

      return div('.video-container', [
        button('.deletevideo', 'Delete Video'),
        br(),
        video('.video', { attrs: videoAttrs }),
        p(`buffer: ${val.buffered}s`)
      ])
    })

  const reducer$ = sources.DOM.select('.deletevideo').events('click')
    .mapTo((prevState: State): State => {
      hls.destroy(element$)
      return undefined
    })

  const sinks: Sinks = {
    DOM: vdom$,
    onion: reducer$,
    hls: hls$
  }

  return sinks
}

export default Video
