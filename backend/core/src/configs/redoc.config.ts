import { Strings } from '@juicyllama/utils'
import { RedocOptions } from '../utils/redoc/interfaces/redocOptions.interface.js'

export const redocConfig = <RedocOptions>{
	title: process.env.PROJECT_NAME ? `${Strings.capitalize(process.env.PROJECT_NAME)} :: API` : 'API',
	logo: {
		url: process.env.BASE_URL_API ? `${process.env.BASE_URL_API}/icon.png` : undefined,
		backgroundColor: '#F0F0F0',
		altText: process.env.npm_package_name,
	},
	requiredPropsFirst: true,
	hideDownloadButton: false,
	hideHostname: false,
	tagGroups: [
		{
			name: 'Core resources',
			tags: ['Auth'],
		},
		{
			name: 'Accounts',
			tags: ['Account', 'Users'],
		},
		{
			name: 'Settings',
			tags: ['Settings'],
		},
	],
	/*generateCodeSamples: {
		languages: ['Node.js'],
	},*/
}
