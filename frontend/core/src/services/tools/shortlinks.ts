import { Api } from '@/helpers/api.js'
import { Shortlink } from '@/types/index.js'

type T = Shortlink

export const ENDPOINT_SHORTLINKS = '/tools/shortlinks'
export const PUSHER_EVENT_SHORTLINKS = `tools_shortlinks`

export class ShortlinkService extends Api<T> {
	constructor() {
		super()
	}
}
