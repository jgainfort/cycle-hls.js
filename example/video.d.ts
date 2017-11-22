/// <reference types="hls.js" />
import { DOMSource, VNode } from '@cycle/dom';
import { Stream } from 'xstream';
import { StateSource } from 'cycle-onionify';
import * as Hls from 'hls.js';
import { HlsjsSource, Config as HlsjsDriverConfig } from '../src';
export declare type Reducer = (prev?: State) => State | undefined;
export interface State {
    sourceURL: string;
    config: Hls.OptionalConfig;
}
export interface Sources {
    DOM: DOMSource;
    onion: StateSource<State>;
    hls: HlsjsSource;
}
export interface Sinks {
    DOM: Stream<VNode>;
    onion: Stream<Reducer>;
    hls: Stream<HlsjsDriverConfig>;
}
declare function Video(sources: Sources): Sinks;
export default Video;
