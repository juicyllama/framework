import type { Dashboard } from '@/types/widget'
import { Api } from '../helpers/api'

type T = Dashboard
export const DASHBOARD_ENDPOINT = '/dashboards'
export const USERS_PUSHER_CHANNEL = 'account_${account_id}_users'

export class WidgetsService extends Api<T> {
}
