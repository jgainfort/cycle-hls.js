import { run } from '@cycle/run'
import isolate from '@cycle/isolate'
import { div, h1, button, p, ul, DOMSource, VNode, makeDOMDriver } from '@cycle/dom'
import onionify, { StateSource, makeCollection } from 'cycle-onionify'
import xs, { Stream } from 'xstream'
import { makeHlsjsDriver } from '../src'
import Video, { State as VideoState, Sinks as VideoSinks } from './video'

type Reducer = (prev?: State) => State | undefined

interface State {
  videos: VideoState[]
}

interface Sources {
  DOM: DOMSource
  onion: StateSource<State>
  Hls: any
}

interface Sinks {
  DOM: Stream<VNode>,
  onion: Stream<Reducer>,
  hls: Stream<any>
}

interface Actions {
  add$: Stream<number>
}

function intent(domSource: DOMSource): Actions {
  return {
    add$: domSource.select('.addvideo').events('click').mapTo(1).startWith(0)
  }
}

function model(actions: Actions): Stream<Reducer> {
  const initialReducer$ = xs.of((prev?: State): State => ({ videos: [] }))
  const addReducer$ = actions.add$.map(count => (prevState: State): State => {
    const len = prevState.videos.length
    return {
      videos: prevState.videos.concat({ id: len + 1 })
    }
  })
  return xs.merge(initialReducer$, addReducer$)
}

function view(videosVNode$: Stream<VNode>): Stream<VNode> {
  return videosVNode$.map(videosVNode =>
    div([
      h1('Cycle-hls.js'),
      button('.addvideo', 'Add Video'),
      videosVNode
    ])
  )
}

function main(sources: Sources): Sinks {

  const Videos = makeCollection({
    item: Video,
    itemKey: (childState, index) => String(index),
    itemScope: key => key,
    collectSinks: instances => {
      return {
        DOM: instances.pickCombine('DOM')
          .map((videoVNodes: VNode[]) => ul(videoVNodes)),
        onion: instances.pickMerge('onion'),
        hls: instances.pickMerge('hls')
      }
    }
  })

  const videosSinks: VideoSinks = isolate(Videos, 'videos')(sources as any)
  const action$ = intent(sources.DOM)
  const parentReducer$ = model(action$)
  const videoReducer$ = videosSinks.onion as any as Stream<Reducer>
  const reducer$ = xs.merge(parentReducer$, videoReducer$)
  const vdom$ = view(videosSinks.DOM)

  const sinks: Sinks = {
    DOM: vdom$,
    onion: reducer$,
    hls: videosSinks.hls
  }

  return sinks
}

const wrappedMain = onionify(main)

const drivers = {
  DOM: makeDOMDriver('#main-container'),
  hls: makeHlsjsDriver()
}

run(wrappedMain, drivers)
