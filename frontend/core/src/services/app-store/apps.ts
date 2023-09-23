import { Api } from '@/helpers/api.js'
import { App } from '@/types/index.js'

type T = App
export const APPS_ENDPOINT = '/apps/store'
export const APPS_PUSHER_EVENT = 'account_${account_id}_apps'
export class AppsService extends Api<T> {}
