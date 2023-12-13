//https://nuxt.com/docs/api/nuxt-config
//https://docus.dev/introduction/configuration
export default defineAppConfig({
	docus: {
		title: 'Docs :: JuicyLlama Rapid Development Framework',
		description: 'Developer portal for working with our open source framework',
		image: 'https://juicyllama.com/assets/images/icon.png',
		socials: {
			github: 'juicyllama/framework',
			discord: 'https://discord.com/invite/KGv76Q9S3s',
			postman: 'https://www.postman.com/juicyllama/workspace/framework/overview',
			youtube: 'https://www.youtube.com/@juicyllama-studio'
		},
		aside: {
			level: 0,
			exclude: [
				'/apps/readme', '/gettingstarted',
			],
			openActiveMenu: true
		},
		header: {
			logo: true,
			textLinks: [{
				text: 'Framework',
				href: '/gettingstarted'
			}, {
				text: 'Apps',
				href: '/apps/readme'
			}],
		},
		footer: {
			credits: {
				icon: '',
				href: 'https://docs.juicyllama.com/',
				text: 'JuicyLlama'
			}
		},
		head: {
			templateParams: {
				separator: '::',
			}
		}
	}
})
