// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/content',
		'nuxt-quasar-ui',
		'@pinia/nuxt',
		//'nuxt-simple-sitemap',
	],
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
	}
})
