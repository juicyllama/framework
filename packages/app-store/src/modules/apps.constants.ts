import { App } from './apps.entity'
import { AppsModule } from './apps.module'
import { AppsController } from './apps.controller'
import { AppsService } from './apps.service'

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
