import {extraLinks, homeLink} from "../config";

export const cliTitle = 'JuicyLlama CLI'
const root = '/cli'

export const cliNavbar = [
	homeLink,
		{
			text: 'CLI',
			link: root,
		},
		{
			text: 'Commands',
			link: root+'/commands',
		},
	...extraLinks,
	]
