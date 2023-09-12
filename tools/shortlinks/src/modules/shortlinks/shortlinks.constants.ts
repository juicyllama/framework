import { Shortlink } from './shortlinks.entity'
import { ShortlinksModule } from './shortlinks.module'
import { ShortlinksService } from './shortlinks.service'
import { ShortlinksController } from './shortlinks.controller'

export const E = Shortlink
export type T = Shortlink
export const NAME = 'shortlink'
export const PRIMARY_KEY = 'shortlink_id'
export const ENDPOINT_URL = '/tools/shortlinks'
export const MODULE = ShortlinksModule
export const CONTROLLER = ShortlinksController
export const SERVICE = ShortlinksService
