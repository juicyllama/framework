import * as pkg from './package.json'

const links = [
	{
		'aria-label': 'Wesbite',
		to: 'https://juicyllama.com',
		icon: 'i-heroicons-computer-desktop-20-solid',
		target: '_blank'
	},
	{
		'aria-label': 'Github',
		to: 'https://github.com/juicyllama/framework',
		icon: 'i-simple-icons-github',
		target: '_blank'
	},
	{
		'aria-label': 'Discord',
		to: 'https://discord.com/invite/KGv76Q9S3s',
		icon: 'i-simple-icons-discord',
		target: '_blank'
	},
	{
		'aria-label': 'Postman',
		to: 'https://www.postman.com/juicyllama/workspace/framework/overview',
		icon: 'i-simple-icons-postman',
		target: '_blank'
	},{
		'aria-label': 'YouTube',
		to: 'https://www.youtube.com/@juicyllama-studio',
		icon: 'i-simple-icons-youtube',
		target: '_blank'
	}
  ]

export default defineAppConfig({
	ui: {
	  primary: 'yellow',
	  gray: 'slate',
	  footer: {
		bottom: {
		  left: 'text-sm text-gray-500 dark:text-gray-400',
		  wrapper: 'border-t border-gray-200 dark:border-gray-800'
		}
	  }
	},
	seo: {
	  siteName: 'Docs :: JuicyLlama Rapid Development Framework',
	},
	header: {
	  logo: {
		alt: '',
		light: '',
		dark: ''
	  },
	  search: true,
	  colorMode: false,
	  links: links
	},
	footer: {
	  credits: 'Copyright © '+ new Date().getFullYear(),
	  colorMode: false,
	  links: links,
	  PACKAGE_VERSION: pkg.version,
	},
	toc: {
	  title: 'Table of Contents',
	  bottom: {
		title: 'Community',
		edit: 'https://github.com/juicyllama/framework/tree/main/common/docs/content',
		links: [{
		  icon: 'i-heroicons-star',
		  label: 'Star on GitHub',
		  to: 'https://github.com/juicyllama/framework',
		  target: '_blank',
		}]
	  }
	}
  })

