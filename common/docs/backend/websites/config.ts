import {extraLinks, homeLink} from "../../config";

export const websitesTitle = 'JuicyLlama Wesbites Module'
const root = '/backend/websites'

export const websitesNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
	...extraLinks,
	]
