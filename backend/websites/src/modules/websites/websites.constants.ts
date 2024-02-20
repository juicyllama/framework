import { ControllerConstants } from '@juicyllama/core'
import { WebsiteDto, CreateWebsiteDto, UpdateWebsiteDto, WebsiteResponeDto } from './websites.dto'
import { Website } from './websites.entity'
import { WebsiteOrderBy, WebsiteRelations, WebsiteSelect } from './websites.enums'

export const WEBSITES_E = Website
export type WEBSITES_T = Website
export const WEBSITES_PRIMARY_KEY = 'website_id'
export const WEBSITES_NAME = 'website'
export const WEBSITES_SEARCH_FIELDS = ['name', 'url']
export const WEBSITES_DEFAULT_ORDER_BY = 'name'

export const CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_DOMAIN =
	'websites::website::cron::service::generateWebsiteScreenshots'
export const CRON_WEBSITES_WEBSITE_ICON_GENERATE_DOMAIN = 'websites::website::cron::service::generateWebsiteIcons'

export const websiteConstants: ControllerConstants = {
	entity: WEBSITES_E,
	name: WEBSITES_NAME,
	primaryKey: WEBSITES_PRIMARY_KEY,
	searchFields: WEBSITES_SEARCH_FIELDS,
	defaultOrderBy: WEBSITES_DEFAULT_ORDER_BY,
	selectEnum: WebsiteSelect,
	orderByEnum: WebsiteOrderBy,
	relationsEnum: WebsiteRelations,
	dtos: {
		base: WebsiteDto,
		create: CreateWebsiteDto,
		update: UpdateWebsiteDto,
		response: WebsiteResponeDto,
	},
}
