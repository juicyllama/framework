import { Log } from './logs.entity'
import { LogsModule } from './logs.module'
import { LogsService } from './logs.service'

export const LOGS_APP_E = Log
export type LOGS_APP_T = Log
export const LOGS_APP_NAME = 'app_logs'
export const LOGS_APP_PRIMARY_KEY = 'log_id'
export const LOGS_APP_MODULE = LogsModule
export const LOGS_APP_SERVICE = LogsService
