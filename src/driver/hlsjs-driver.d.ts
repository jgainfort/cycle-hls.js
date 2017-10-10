/// <reference types="hls.js" />
import { Stream, MemoryStream } from 'xstream';
import * as Hls from 'hls.js';
export interface Config {
    element$: MemoryStream<Element[]>;
    sourceURL: string;
    config?: Hls.OptionalConfig;
}
export interface HlsjsSource {
    selectHlsEvent: (element$: MemoryStream<Element[]>, events: string[]) => Stream<HlsjsEvent>;
    selectVideoEvent: (element$: MemoryStream<Element[]>, events: string[]) => Stream<VideoEvent>;
    destroy: (element$: MemoryStream<Element[]>) => void;
    version: () => string;
}
export interface HlsjsEvent {
    type: string;
    data: Hls.Data;
    instance: HlsInstance;
}
export interface VideoEvent {
    event: Event;
    instance: HlsInstance;
}
export interface HlsInstance {
    hls: Hls;
    video: HTMLVideoElement;
    config: Config;
}
export declare function makeHlsjsDriver(): (source$: MemoryStream<Config>) => HlsjsSource;
