import {extraLinks, homeLink} from "../../config";

export const appsScrapingBeeTitle = 'JuicyLlama ScrapingBee App'
const root = '/apps/scrapingbee'

export const appsScrapingBeeNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
		{
			text: 'Methods',
			link: root+'/methods',
		},
	...extraLinks,
	]
