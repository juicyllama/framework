import { ControllerConstants } from '@juicyllama/core'
import { Connection } from './connection.entity'

export const CONNECTION_E = Connection
export type CONNECTION_T = Connection
export const CONNECTION_PRIMARY_KEY = 'connection_id'
export const CONNECTION_NAME = 'connection'
export const CONNECTION_SEARCH_FIELDS = []
export const CONNECTION_DEFAULT_ORDER_BY = 'created_at'
export const CONNECTION_WEBSOCKET_EVENT = 'user_${user_id}_social_connection'
export const CONNECTION_ENDPOINT = '/social/connection'

export const connectionConstants: ControllerConstants = {
	entity: CONNECTION_E,
	name: CONNECTION_NAME,
	primaryKey: CONNECTION_PRIMARY_KEY,
	searchFields: CONNECTION_SEARCH_FIELDS,
	defaultOrderBy: CONNECTION_DEFAULT_ORDER_BY,
	//selectEnum: ActivitySelect,
	//orderByEnum: ActivityOrderBy,
	//relationsEnum: ActivityRelations,
	//dtos: {
	//	base: ActivityDto,
	//	response:
	//},
}
