import {extraLinks, homeLink} from "../../config";

export const nestJsRedocTitle = 'JuicyLlama NestJs Redoc'
const root = '/common/nestjs-redoc'

export const nestJsRedocNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
		{
			text: 'Redoc Options',
			link: root+'/options',
		},
	...extraLinks,
	]
