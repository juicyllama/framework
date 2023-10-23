import { Website } from "./websites.entity"

export const WEBSITES_E = Website
export type WEBSITES_T = Website
export const WEBSITES_PRIMARY_KEY = 'website_id'
export const WEBSITES_NAME = 'website'
export const WEBSITES_SEARCH_FIELDS = ['name', 'url']
export const WEBSITES_DEFAULT_ORDER_BY = 'name'