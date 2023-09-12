import {extraLinks, homeLink} from "../../config";

export const appsGoogleTitle = 'JuicyLlama Google App'
const root = '/apps/google'

export const appsGoogleNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
		{
			text: 'Modules',
			children: [
				{
					text: 'Geocoding',
					link: root+'/methods/geocoding',
				},
				{
					text: 'Places',
					link: root+'/methods/places',
				},
			]
		},
	...extraLinks,
	]
