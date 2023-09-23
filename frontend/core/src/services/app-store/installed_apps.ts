import { Api } from '@/helpers/api.js'
import { InstalledApp } from '@/types/index.js'

type T = InstalledApp
export const INSTALLED_APPS_ENDPOINT = '/apps/installed'
export const INSTALLED_PUSHER_EVENT = 'account_${account_id}_apps_installed'
export class InstalledAppsService extends Api<T> {}
