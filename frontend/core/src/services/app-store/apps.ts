import { Api } from '../../helpers'
import { App } from '../../types'

type T = App
export const APPS_ENDPOINT = '/apps/store'
export const APPS_WEBSOCKET_EVENT = 'account_${account_id}_apps'
export class AppsService extends Api<T> {
	constructor() {
		super(APPS_ENDPOINT)
	}
}
