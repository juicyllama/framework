import { Shortlink } from './shortlinks.entity.js'
import { ShortlinksModule } from './shortlinks.module.js'
import { ShortlinksService } from './shortlinks.service.js'
import { ShortlinksController } from './shortlinks.controller.js'

export const E = Shortlink
export type T = Shortlink
export const NAME = 'shortlink'
export const PRIMARY_KEY = 'shortlink_id'
export const ENDPOINT_URL = '/tools/shortlinks'
export const MODULE = ShortlinksModule
export const CONTROLLER = ShortlinksController
export const SERVICE = ShortlinksService
