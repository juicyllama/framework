import { ShortlinkClick } from './clicks.entity.js'
import { ShortlinkClicksModule } from './clicks.module.js'
import { ShortlinkClicksService } from './clicks.service.js'

export const E = ShortlinkClick
export type T = ShortlinkClick
export const NAME = 'shortlinks click'
export const PRIMARY_KEY = 'shortlink_click_id'
export const MODULE = ShortlinkClicksModule
export const SERVICE = ShortlinkClicksService
