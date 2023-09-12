import {extraLinks, homeLink} from "../../config";

export const appsSlackTitle = 'JuicyLlama Slack App'
const root = '/apps/slack'

export const appsSlackNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
	{
		text: 'Methods',
		link: root + '/methods',
	},
	...extraLinks,
	]
