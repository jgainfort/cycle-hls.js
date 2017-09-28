import { adapt } from '@cycle/run/lib/adapt'
import { VNode } from '@cycle/dom'
import xs, { Stream, MemoryStream } from 'xstream'
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
  hls: Hls
  video: HTMLVideoElement
}

export function makeHlsjsDriver() {
  if (!Hls.isSupported()) {
    throw new Error('MSE are not supported in your browser')
  }

  function hlsjsDriver(input$: Stream<any>, name = 'Hls') {
    let instances: HlsInstance[] = []
    const instances$ = xs.of(instances)
      .map(val => console.log('val: ', val))

    function init(element$: MemoryStream<Element[]>, src: string, config: Hls.OptionalConfig = {}): Stream<HlsInstance[]> {
      element$.addListener({
        next: elArr => {
          if (elArr.length > 0) {
            const video = elArr[0] as HTMLVideoElement

            if (!instances.some(val => val.video === video)) {
              const hls = new Hls(config)
              hls.attachMedia(video)

              hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                if (src) {
                  hls.loadSource(src)
                }
              })

              instances = [...instances, { hls: hls, video: video }]
            }
          }
        }
      })

      return adapt(instances$)
    }

    function get(events: string[]) {
      const event$ = xs.create({
        start: listener => {

        },
        stop: () => { }
      })

      return adapt(event$)
    }

    function destroy(element$: MemoryStream<Element[]>) {
      element$.subscribe({
        next: (arr: Element[]) => {
          if (arr.length > 0) {
            const video = arr[0] as HTMLVideoElement
            instances = instances.filter(val => {
              let result = true
              if (val.video === video) {
                val.hls.destroy()
                result = false
              }
              return result
            })
          }
        },
        error: () => { },
        complete: () => { }
      })

      return adapt(xs.of(instances))
    }

    return {
      init: init,
      destroy: destroy
    }
  }

  return hlsjsDriver
}
