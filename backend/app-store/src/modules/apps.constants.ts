import { App } from './apps.entity'
import { AppsModule } from './apps.module'
import { AppsController } from './apps.controller'
import { AppsService } from './apps.service'
import { AppOrderBy, AppSelect, AppRelations } from './apps.enums'
import { AppDto } from './apps.dto'
import { ControllerConstants } from '@juicyllama/core'

export const APP_E = App
export type APP_T = App
export const APP_NAME = 'app'
export const APP_SEARCH_FIELDS = ['name', 'integration_name']
export const APP_DEFAULT_ORDER_BY = 'name'
export const APP_PRIMARY_KEY = 'app_id'
export const APP_ENDPOINT_URL = '/apps/store'
export const APP_MODULE = AppsModule
export const APP_CONTROLLER = AppsController
export const APP_SERVICE = AppsService

export const appConstants: ControllerConstants = {
    entity: APP_E,
    name: APP_NAME,
    primaryKey: APP_PRIMARY_KEY,
    searchFields: APP_SEARCH_FIELDS,
    defaultOrderBy: APP_DEFAULT_ORDER_BY,
    selectEnum: AppSelect,
	orderByEnum: AppOrderBy,
	relationsEnum: AppRelations,
    dtos: {
		base: AppDto,
	},
}