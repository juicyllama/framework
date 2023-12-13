//https://nuxt.com/docs/api/nuxt-config
//https://docus.dev/introduction/configuration
export default defineAppConfig({
	docus: {
		title: 'Docs :: JuicyLlama Rapid Development Framework',
		description: 'Developer portal for working with our open source framework',
		image: 'https://juicyllama.com/assets/images/icon.png',
		socials: {
			web: {
				label: 'Wesbite',
				href: 'https://juicyllama.com',
				icon: 'ph:monitor'
			},
			github: 'juicyllama/framework',
			discord: {
				label: 'Discord',
				href: 'https://discord.com/invite/KGv76Q9S3s',
				icon: 'ph:discord-logo'
			},
			postman: {
				label: 'Postman',
				href: 'https://www.postman.com/juicyllama/workspace/framework/overview',
				icon: 'devicon-plain:postman'
			},
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
