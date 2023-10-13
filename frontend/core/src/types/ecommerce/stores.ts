import { InstalledApp } from '../appstore'
import { Website } from '../websites/index'

export interface EcommerceStore {
    store_id: number
    account_id: number
    website_id?: number
    website: Website
    installed_app_id?: number
    installed_app: InstalledApp
}