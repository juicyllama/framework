import { Api } from '../../helpers'
import { Website } from '../../types'

type T = Website
export const WEBSITE_ENDPOINT = '/websites/website'
export const WEBSITE_PUSHER_EVENT = 'account_${account_id}_websites'

export class WebsiteService extends Api<T> {
	constructor() {
		super(WEBSITE_ENDPOINT)
	}
}

export const websiteService = new WebsiteService()
