import {extraLinks, homeLink} from "../../config";

export const shortlinksTitle = 'JuicyLlama Shortlinks Tool'
const root = '/tools/shortlinks'

export const shortlinksNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
		{
			text: 'Usage',
			link: root+'/usage',
		},
	...extraLinks,
	]
