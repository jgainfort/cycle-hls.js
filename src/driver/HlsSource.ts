import { Stream } from 'xstream'
import * as Hls from 'hls.js'

export interface HlsSource {
  select(selector: string): Stream<{ event: string, data: Hls.Data }>
}
