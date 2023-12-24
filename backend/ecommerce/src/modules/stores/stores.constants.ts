import { ControllerConstants } from '@juicyllama/core'
import { Store } from './stores.entity'
import { StoreSelect, StoreOrderBy, StoreRelations } from './stores.enums'
import { StoreDto, CreateStoreDto, UpdateStoreDto, StoreResponeDto } from './stores.dto'

export const STORE_E = Store
export type STORE_T = Store
export const STORE_PRIMARY_KEY = 'store_id'
export const STORE_NAME = 'stores'
export const STORE_SEARCH_FIELDS = []
export const STORE_DEFAULT_ORDER_BY = 'created_at'

export const storeConstants: ControllerConstants = {
	entity: STORE_E,
	name: STORE_NAME,
	primaryKey: STORE_PRIMARY_KEY,
	searchFields: STORE_SEARCH_FIELDS,
	defaultOrderBy: STORE_DEFAULT_ORDER_BY,
	selectEnum: StoreSelect,
	orderByEnum: StoreOrderBy,
	relationsEnum: StoreRelations,
	dtos: {
		base: StoreDto,
		create: CreateStoreDto,
		update: UpdateStoreDto,
		response: StoreResponeDto,
	},
}
