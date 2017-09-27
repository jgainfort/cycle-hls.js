import { adapt } from '@cycle/run/lib/adapt'
import xs, { Stream } from 'xstream'
import * as Hls from 'hls.js'
import { HlsSource } from './HlsSource'

// const api = {
//   attachMedia: (): void => hls.attachMedia(videoElement),
//   audioTracks: (): AudioTrack[] => hls.audioTracks,
//   audioTrack: (id?: number): void | number => id === undefined ? hls.audioTrack = id : hls.audioTrack,
//   autoLevelCapping: (): number => hls.autoLevelCapping,
//   autoLevelEnabled: (): boolean => hls.autoLevelEnabled,
//   currentLevel: (level?: number): void | number => level === undefined ? hls.currentLevel = level : hls.currentLevel,
//   detachMedia: (): void => hls.detachMedia(),
//   firstLevel: (): number => hls.firstLevel,
//   levels: (): number[] => hls.levels,
//   liveSyncPosition: (): number => hls.liveSyncPosition,
//   loadLevel: (level?: number): void | number => level === undefined ? hls.loadLevel = level : hls.loadLevel,
//   nextLoadLevel: (level?: number): void | number => level === undefined ? hls.nextLoadLevel = level : hls.nextLoadLevel,
//   nextLevel: (level?: number): void | number => level === undefined ? hls.nextLevel = level : hls.nextLevel,
//   startLevel: (level?: number): void | number => level === undefined ? hls.startLevel = level : hls.startLevel,
//   startLoad: (position?: number): void => position === undefined ? hls.startLoad(position) : hls.startLoad(),
//   stopLoad: (): void => hls.stopLoad(),
//   version: (): string => Hls.version
// }

// function makeSelect(val: any, hls: any) {
//   console.log('makeSelect > ', val)
//   const source$ = xs.create({
//     start: listener => {
//       console.log('makeSelect listener > ', listener)
//     },
//     stop: () => { }
//   })
//   return adapt(source$)
// }

export interface HlsInstance {
  id: number
  hls: Hls
  video: HTMLVideoElement
}

export function makeHlsjsDriver() {
  if (!Hls.isSupported()) {
    throw new Error('MSE not supported in your browser')
  }

  function hlsjsDriver(input$: Stream<any>, name = 'Hls') {
    let instances: HlsInstance[] = []

    input$.addListener({ next: val => console.log('val: ', val) })

    function initHls(id: number, videoId: string, src: string, config: Hls.OptionalConfig = {}) {
      if (!instances.some(instance => instance.id === id)) {
        const video = document.getElementById(videoId) as HTMLVideoElement
        const hls = new Hls(config)
        hls.attachMedia(video)

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          if (src) {
            hls.loadSource(src)
          }
        })

        instances = [...instances, { id: id, hls: hls, video: video }]
      }

      return adapt(xs.of(instances))
    }

    function destroyHls(id: number) {
      instances = instances.filter(instance => {
        if (instance.id === id) {
          instance.hls.destroy()
          return false
        }
        return true
      })
      return adapt(xs.of(instances))
    }

    return {
      init: initHls,
      destroy: destroyHls
    }
  }

  return hlsjsDriver
}
