import {extraLinks, homeLink} from "../../config";

export const dataCacheTitle = 'JuicyLlama Data Cache'
const root = '/backend/data-cache'

export const dataCacheNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
	...extraLinks,
	]
