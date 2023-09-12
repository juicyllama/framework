import {extraLinks, homeLink} from "../../config";

export const appsPexelsTitle = 'JuicyLlama Pexels App'
const root = '/apps/pexels'

export const appsPexelsNavbar = [
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
