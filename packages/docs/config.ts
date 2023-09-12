export const homeLink = {
		text: '🏠',
		link: '/',
	}

export const extraLinks = [{
	text: 'Support',
	link: '/support',
}]

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
			}
		]
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
		],
	},
	{
		text: 'Frontend',
		children: [
			{
				text: 'Quasar',
				link: '/frontend/quasar',
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
