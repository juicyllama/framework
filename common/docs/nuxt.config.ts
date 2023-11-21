// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/content',
		'nuxt-quasar-ui',
		'@pinia/nuxt',
		'@nuxt/ui',
		//'nuxt-simple-sitemap',
	],
	ui: {
		global: true,
	},
	devtools: { enabled: true },
	extends: '@nuxt-themes/docus',
	typescript: {
		tsConfig: {
			compilerOptions: {
				verbatimModuleSyntax: false
			}
		}
	},
	sourcemap: {
		server: false,
		client: false
	},
	nitro: {
		prerender: {
			crawlLinks: true,
			failOnError: false
		}
	},
	runtimeConfig: {
		public: {
			siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://docs.juicyllama.com/'
		}
	},
	content: {
		defaultLocale: 'en',
		experimental: {
		  search: {
			indexed: false
		  }
		},
		markdown: {
			mdc: true,
		},
		highlight: {
			preload: ['sql'],
		  }
	  }
})
