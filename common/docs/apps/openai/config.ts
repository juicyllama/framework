import {extraLinks, homeLink} from "../../config";

export const appsOpenAiTitle = 'JuicyLlama OpenAi App'
const root = '/apps/openai'

export const appsOpenAiNavbar = [
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
