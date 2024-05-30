import { ControllerConstants } from '@juicyllama/core'
import { Points } from './points.entity'

export const POINTS_E = Points
export type POINTS_T = Points
export const POINTS_PRIMARY_KEY = 'points_id'
export const POINTS_NAME = 'points'
export const POINTS_SEARCH_FIELDS = []
export const POINTS_DEFAULT_ORDER_BY = 'created_at'
export const POINTS_WEBSOCKET_EVENT = 'user_${user_id}_social_points'
export const POINTS_ENDPOINT = '/social/points'

export const pointsConstants: ControllerConstants = {
	entity: POINTS_E,
	name: POINTS_NAME,
	primaryKey: POINTS_PRIMARY_KEY,
	searchFields: POINTS_SEARCH_FIELDS,
	defaultOrderBy: POINTS_DEFAULT_ORDER_BY,
	//selectEnum: ActivitySelect,
	//orderByEnum: ActivityOrderBy,
	//relationsEnum: ActivityRelations,
	//dtos: {
	//	base: ActivityDto,
	//	response:
	//},
}
