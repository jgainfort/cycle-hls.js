import { adapt } from '@cycle/run/lib/adapt'
import xs, { Stream } from 'xstream'
import * as Hls from 'hls.js'

/**
 * attachMedia(videoElement)
 * detachMedia()
 * levels
 * currentLevel
 * nextLevel
 * loadLevel
 * nextLoadLevel
 * firstLevel
 * startLevel
 * autoLevelEnabled
 * autoLevelCapping
 * Hls.version
 * startLoad(startPosition=-1)
 * stopLoad()
 * audioTracks
 * audioTrack
 * liveSyncPosition
 */

function makeSelect(val: any) {
  console.log('makeSelect > ', val)
  const source$ = xs.create({
    start: listener => {
      console.log('listener > ', listener)
    },
    stop: () => { }
  })
  return adapt(source$)
}

function initHlsEventListener(listener, hls) {
  listener.events.forEach(event => hls.on(event, (type: string, data: Hls.Data) => {
    console.log('ev > type: ', type, 'data: ', data, 'listener: ', listener)
    // listener.next({ event: type, data: data })
  }))
}

export function makeHlsjsDriver(id: string, sourceUrl?: string, config?: Hls.OptionalConfig) {
  if (!Hls.isSupported()) {
    throw new Error('MSE not supported in your browser')
  }

  const video = document.getElementById(id) as HTMLVideoElement
  const hls = new Hls(config)
  hls.attachMedia(video)

  hls.on(Hls.Events.MEDIA_ATTACHED, () => {
    if (sourceUrl) {
      hls.loadSource(sourceUrl)
    }
  })

  function hlsjsDriver(input$: Stream<any>, name = 'Hls') {
    input$.take(1)
      .addListener({
        next: listener => initHlsEventListener(listener, hls),
        error: () => { },
        complete: () => { }
      })

    const hlsSource = {
      select: (val: any) => makeSelect(val)
    }

    return hlsSource
  }

  return hlsjsDriver
}
