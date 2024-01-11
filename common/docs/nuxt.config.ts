import vitePluginRequire from "vite-plugin-require";
export default defineNuxtConfig({
	//extends: ['@nuxt-themes/docus'],
	modules: [
		'@nuxt/content',
		'@nuxtjs/google-fonts',
		'nuxt-quasar-ui',
		'@pinia/nuxt',
		'@nuxt/ui',
		'nuxt-icon',
		'@nuxtjs/color-mode',
		'@nuxtjs/tailwindcss'
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
	devtools: { enabled: process.env.NODE_ENV === 'development' },
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
			crawlLinks: false,
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
	vite: {
		plugins: [
			vitePluginRequire()
		]
	}
})
