import {extraLinks, homeLink} from "../../config";

export const appsWordpressTitle = 'JuicyLlama WordPress App'
const root = '/apps/wordpress'

export const appsWordpressNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
	{
		text: 'Modules',
		children: [
			{
				text: 'Posts',
				link: root+'/modules/posts',
			},
			{
				text: 'Users',
				link: root+'/modules/users',
			},
		],
	},
	...extraLinks,
	]
