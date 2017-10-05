import { adapt } from '@cycle/run/lib/adapt'
import { VNode } from '@cycle/dom'
import xs, { Stream, MemoryStream, Producer } from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import fromEvent from 'xstream/extra/fromEvent'
import * as Hls from 'hls.js'

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

export interface Config {
  element$: MemoryStream<Element[]>
  sourceURL: string
  config?: Hls.OptionalConfig
}

export interface HlsjsSource {
  selectHlsEvent: (element$: MemoryStream<Element[]>, events: string[]) => Stream<HlsjsEvent>
  selectVideoEvent: (element$: MemoryStream<Element[]>, events: string[]) => Stream<VideoEvent>
  destroy: (element$: MemoryStream<Element[]>) => void
}

export interface HlsjsEvent {
  type: string,
  data: Hls.Data,
  instance: HlsInstance
}

export interface VideoEvent {
  event: Event,
  instance: HlsInstance
}

export interface HlsInstance {
  hls: Hls
  video: HTMLVideoElement
  config: Config
}

export function makeHlsjsDriver() {
  if (!Hls.isSupported()) {
    throw new Error('MSE are not supported in your browser')
  }

  function hlsjsDriver(source$: MemoryStream<Config>): HlsjsSource {
    // init instances
    let instances: HlsInstance[] = []

    // create stream of instances
    const instances$: Stream<HlsInstance[]> = xs.create({
      start: listener => {
        source$
          .addListener({
            next: source => {
              source.element$.addListener({
                next: elArr => {
                  if (elArr.length > 0) {
                    const video = elArr[0] as HTMLVideoElement

                    if (!instances.some(val => val.video === video)) {
                      const hls = new Hls(source.config ? source.config : {})
                      hls.attachMedia(video)

                      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                        if (source.sourceURL) {
                          hls.loadSource(source.sourceURL)
                        }
                      })

                      instances = [...instances, { hls: hls, video: video, config: source }]
                      listener.next(instances)
                    }
                  }
                }
              })
            },
            error: () => {
              console.log('error: driver')
            },
            complete: () => {
              console.log('complete: driver')
            }
          })
      },
      stop: () => { }
    })

    /**
     * destroys hls.js instance no need to return
     *
     * @param {MemoryStream<Element[]>} element$
     */
    function destroy(element$: MemoryStream<Element[]>): void {
      element$.addListener({
        next: elArr => {
          if (elArr && elArr.length > 0) {
            const video = elArr[0] as HTMLVideoElement
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
    }

    /**
     * Given a VNode and an hls event, subscribe to the event and pass to listener
     *
     * @param {MemoryStream<Element[]>} element$
     * @param {string} event
     * @returns {MemoryStream<HlsjsEvent>}
     */
    function selectHlsEvent(element$: MemoryStream<Element[]>, events: string[]): MemoryStream<HlsjsEvent> {
      const event$ = xs.create({
        start: listener => {
          instances$
            .compose(sampleCombine(element$))
            .addListener({
              next: ([instances, elArr]) => {
                if (elArr && elArr.length > 0) {
                  const video = elArr[0] as HTMLVideoElement
                  const instance = instances.filter(val => val.video === video)[0]

                  if (instance && events && events.length > 0) {
                    events.forEach(event => {
                      instance.hls.on(event, (type, data) => {
                        listener.next({ type: type, data: data, instance: instance })
                      })
                    })
                  }
                }
              }
            })
        },
        stop: () => { }
      })

      return adapt(event$)
    }

    function selectVideoEvent(element$: MemoryStream<Element[]>, events: string[]): MemoryStream<VideoEvent> {
      const event$ = xs.create({
        start: listener => {
          instances$
            .compose(sampleCombine(element$))
            .addListener({
              next: ([instances, elArr]) => {
                if (elArr && elArr.length > 0) {
                  const video = elArr[0] as HTMLVideoElement
                  const instance = instances.filter(val => val.video === video)[0]

                  if (instance && events && events.length > 0) {
                    events.forEach(event => {
                      fromEvent(instance.video, event)
                        .addListener({
                          next: ev => {
                            listener.next({ event: ev, instance: instance })
                          }
                        })
                    })
                  }
                }
              }
            })
        },
        stop: () => { }
      })

      return adapt(event$)
    }

    return {
      selectHlsEvent: selectHlsEvent,
      selectVideoEvent: selectVideoEvent,
      destroy: destroy
    }
  }

  return hlsjsDriver
}
