import { Api } from '../../helpers'
import { Shortlink } from '../../types'

type T = Shortlink

export const ENDPOINT_SHORTLINKS = '/tools/shortlinks'
export const PUSHER_EVENT_SHORTLINKS = `tools_shortlinks`

export class ShortlinkService extends Api<T> {
	constructor() {
		super()
	}
}
