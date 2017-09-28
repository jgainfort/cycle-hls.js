import { DOMSource, VNode, p, video, div, button, span, br } from '@cycle/dom'
import xs, { Stream } from 'xstream'
import { StateSource } from 'cycle-onionify'

export type Reducer = (prev?: State) => State | undefined

export interface State {
  id: number
}

export interface Sources {
  DOM: DOMSource,
  onion: StateSource<State>,
  Hls: any
}

export interface Sinks {
  DOM: Stream<VNode>,
  onion: Stream<Reducer>,
  Hls: Stream<any>
}

function Video(sources: Sources): Sinks {
  const state$ = sources.onion.state$
  const Hls = sources.Hls

  const element$ = sources.DOM.select('.video').elements()

  console.log('Hls: ', Hls)

  const hls$ = Hls.init(element$, 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8')

  const reducer$ = sources.DOM.select('.deletevideo').events('click')
    .mapTo((prevState: State): State => {
      Hls.destroy(element$)
      return undefined
    })

  const vdom$ = state$.map(state => {
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
      video(`.video`, { attrs: videoAttrs })
    ])
  })

  const sinks: Sinks = {
    DOM: vdom$,
    onion: reducer$,
    Hls: hls$
  }

  return sinks
}

export default Video
