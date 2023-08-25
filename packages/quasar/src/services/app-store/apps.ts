import { Api } from '@/helpers'
import { App } from '@/types'

type T = App
export const APPS_ENDPOINT = '/apps/store'
export const APPS_PUSHER_EVENT = 'account_${account_id}_apps'
export class AppsService extends Api<T> {}
