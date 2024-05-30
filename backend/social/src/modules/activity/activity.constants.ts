import { ControllerConstants } from '@juicyllama/core'
import { Activity } from './activity.entity'

export const ACTIVITY_E = Activity
export type ACTIVITY_T = Activity
export const ACTIVITY_PRIMARY_KEY = 'activity_id'
export const ACTIVITY_NAME = 'activity'
export const ACTIVITY_SEARCH_FIELDS = []
export const ACTIVITY_DEFAULT_ORDER_BY = 'last_seen_at'
export const ACTIVITY_WEBSOCKET_EVENT = 'user_${user_id}_social_activity'
export const ACTIVITY_ENDPOINT = '/social/activity'

export const activityConstants: ControllerConstants = {
	entity: ACTIVITY_E,
	name: ACTIVITY_NAME,
	primaryKey: ACTIVITY_PRIMARY_KEY,
	searchFields: ACTIVITY_SEARCH_FIELDS,
	defaultOrderBy: ACTIVITY_DEFAULT_ORDER_BY,
	//selectEnum: ActivitySelect,
	//orderByEnum: ActivityOrderBy,
	//relationsEnum: ActivityRelations,
	//dtos: {
	//	base: ActivityDto,
	//	response:
	//},
}
