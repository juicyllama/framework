/**
 * Takes a query object and returns a new object with mapped values to APP SETTINGS based on the app type, this helps with the Oauth flow
 */

import _ from 'lodash'
import { AppStoreIntegrationName } from '../apps.enums'

export function oauthQueryMappers(query: any): any {
	switch (query.integration_name) {
		case AppStoreIntegrationName.shopify:
			const result = {
				integration_name: query.integration_name,
				SHOPIFY_SHOP_NAME: query.shop ? query.shop.replace(/.myshopify.com/g, '') : null,
			}

			return _.omitBy(result, _.isNil)
	}
}
