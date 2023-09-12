import { ShortlinkClick } from './clicks.entity'
import { ShortlinkClicksModule } from './clicks.module'
import { ShortlinkClicksService } from './clicks.service'

export const E = ShortlinkClick
export type T = ShortlinkClick
export const NAME = 'shortlinks click'
export const PRIMARY_KEY = 'shortlink_click_id'
export const MODULE = ShortlinkClicksModule
export const SERVICE = ShortlinkClicksService
