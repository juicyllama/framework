import {extraLinks, homeLink} from "../../config";

export const appsShopifyTitle = 'JuicyLlama Shopify App'
const root = '/apps/shopify'

export const appsShopifyNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
	{
		text: 'Modules',
		children: [
			{
				text: 'Auth',
				link: root+'/modules/auth',
			},
			{
				text: 'Orders',
				link: root+'/modules/orders',
			},
		],
	},
	...extraLinks,
	]
