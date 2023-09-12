import {extraLinks, homeLink} from "../../config";

export const aiTitle = 'JuicyLlama AI Module'
const root = '/backend/ai'

export const aiNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
		{
			text: 'Usage',
			link: root+'/usage',
		},
	...extraLinks,
	]
