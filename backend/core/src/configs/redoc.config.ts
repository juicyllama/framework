import { RedocOptions } from '@juicyllama/nestjs-redoc'
import { Strings } from '@juicyllama/utils'

export const redocConfig = <RedocOptions>{
	title: `${Strings.capitalize(process.env.PROJECT_NAME)} :: API`,
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
	],
	/*generateCodeSamples: {
		languages: ['Node.js'],
	},*/
}
