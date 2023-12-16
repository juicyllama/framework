// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	extends: ['@nuxt-themes/docus'],
	modules: [
		'@nuxt/content',
		'@nuxtjs/google-fonts',
		'nuxt-quasar-ui',
		'@pinia/nuxt',
		'@nuxt/ui',
		'nuxt-icon',
		'@nuxtjs/color-mode'
	],
	colorMode: {
		preference: 'dark',
    	fallback: 'dark',
		storageKey: 'jl-docs-color-mode'
	},
	ui: {
		global: true,
		icons: 'all'
	},
	devtools: { enabled: true },
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
	},
	googleFonts: {
		families: {
		  Nunito:  [400, 500, 600, 700, 800, 900],
		}
	  },
})
