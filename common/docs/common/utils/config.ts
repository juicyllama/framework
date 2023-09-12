import {extraLinks, homeLink} from "../../config";

export const utilsTitle = 'JuicyLlama Utils'
const root = '/common/utils'

export const utilsNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
	{
		text: 'Utils',
		link: root+'/Utils',
	},
		{
			text: 'Assets',
			link: root+'/assets',
		},
		{
			text: 'DTOs',
			link: root+'/dtos',
		},
	{
		text: 'Enums',
		link: root+'/enums',
	},
	...extraLinks,
	]
