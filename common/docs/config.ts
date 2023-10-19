// import VueExamplePlugin from 'vuepress-plugin-vue-example'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { getDirname } from '@vuepress/utils'
import path from 'path'

export const homeLink = {
	text: '🏠',
	link: '/',
}

export const extraLinks = [
	{
		text: 'Support',
		link: '/support',
	},
]

export const homeTitle = 'JuicyLlama Framework'

export const homeNavbar = [
	homeLink,
	{
		text: 'CLI',
		link: '/cli',
		children: [
			{
				text: 'Setup',
				link: '/cli/',
			},
			{
				text: 'Commands',
				link: '/cli/commands',
			},
		],
	},
	{
		text: 'Common',
		children: [
			{
				text: 'Utils',
				link: '/common/utils',
			},
			{
				text: 'Dev',
				link: '/common/dev',
			},
			{
				text: 'Vue Dev',
				link: '/common/vue-dev',
			},
		],
	},
	{
		text: 'Backend',
		children: [
			{
				text: 'Core',
				link: '/backend/core',
			},
			{
				text: 'Ai',
				link: '/backend/ai',
			},
			{
				text: 'Billing',
				link: '/backend/billing',
			},
			{
				text: 'CRM',
				link: '/backend/crm',
			},
			{
				text: 'Ecommerce',
				link: '/backend/ecommerce',
			},
			{
				text: 'Websites',
				link: '/backend/websites',
			},
		],
	},
	{
		text: 'Frontend',
		children: [
			{
				text: 'Core',
				link: '/frontend/core',
			},
			{
				text: 'Testing',
				link: '/frontend/tests',
			},
			{
				text: 'Vue Utils',
				link: '/frontend/vue-utils',
			},
		],
	},
	{
		text: 'Apps',
		children: [
			{
				text: 'Google',
				link: '/apps/google',
			},
			{
				text: 'OpenAi',
				link: '/apps/openai',
			},
			{
				text: 'Pexels',
				link: '/apps/pexels',
			},
			{
				text: 'ScrapingBee',
				link: '/apps/scrapingbee',
			},
			{
				text: 'Shopify',
				link: '/apps/shopify',
			},
			{
				text: 'Slack',
				link: '/apps/slack',
			},
			{
				text: 'Wordpress',
				link: '/apps/wordpress',
			},
		],
	},
	{
		text: 'Tools',
		children: [
			{
				text: 'QR Codes',
				link: '/tools/qrcodes',
			},
			{
				text: 'Shortlinks',
				link: '/tools/shortlinks',
			},
		],
	},
	...extraLinks,
]

// export default {
// 	plugins: [
// 		VueExamplePlugin({
// 			componentsPath: '../../frontend/core/src/components/common/stats/',
// 		}),
// 	],
// }
const __dirname = getDirname(import.meta.url)

console.log('__dirname!!!', __dirname)

export default {
	plugins: [
		registerComponentsPlugin({
			// components: {
			// 	JLStats: path.resolve(__dirname, '../../frontend/core/src/components/common/stats/Stats.vue'),
			// },
			componentsDir: path.resolve(__dirname, '../../frontend/core/src/components/common/stats'),
		}),
	],
}
