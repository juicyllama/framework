import {homeLink} from "../../config";

export const frontendTestTitle = 'JuicyLlama Testing'
const root = '/frontend/tests'

export const frontendTestNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
		{
			text: 'Components',
			link: root + '/components'
		},
		{
			text: 'Stores',
			link: root +'/stores'
		}
	]
