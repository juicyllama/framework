import { Api } from '../../helpers'
import { Setting } from '../../types'

type T = Setting
export const SETTINGS_ENDPOINT = '/settings'
export const SETTINGS_PUSHER_EVENT = 'account_${account_id}_settings'
export class SettingsService extends Api<T> {
    constructor() {
		super(SETTINGS_ENDPOINT)
	  }
}
