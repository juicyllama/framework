import {extraLinks, homeLink} from "../../config";

export const appStoreTitle = 'JuicyLlama App Store'
const root = '/backend/app-store'

export const appStoreNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
	...extraLinks,
	]
