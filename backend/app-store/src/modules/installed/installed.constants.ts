import { InstalledAppsController } from './installed.controller'
import { InstalledApp } from './installed.entity'
import { InstalledAppsModule } from './installed.module'
import { InstalledAppsService } from './installed.service'

export const INSTALLED_APP_E = InstalledApp
export type INSTALLED_APP_T = InstalledApp
export const INSTALLED_APP_NAME = 'install app'
export const INSTALLED_APP_SEARCH_FIELDS = ['name']
export const INSTALLED_APP_DEFAULT_ORDER_BY = 'name'
export const INSTALLED_APP_PRIMARY_KEY = 'installed_app_id'
export const INSTALLED_APP_ENDPOINT_URL = '/apps/installed'
export const INSTALLED_APP_MODULE = InstalledAppsModule
export const INSTALLED_APP_CONTROLLER = InstalledAppsController
export const INSTALLED_APP_SERVICE = InstalledAppsService
export const INSTALLED_APPS_PUSHER_EVENT = 'account_${account_id}_apps_installed'
