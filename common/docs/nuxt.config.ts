// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: true,
	extends: ['@nuxt/ui-pro'],
	modules: [
	  '@nuxt/content',
	  '@nuxt/ui',
	  '@nuxthq/studio',
	  '@nuxtjs/fontaine',
	  '@nuxtjs/google-fonts',
	  'nuxt-og-image',
	  '@nuxtjs/tailwindcss'
	],
	hooks: {
	  'components:extend': (components) => {
		const globals = components.filter((c) => ['UButton', 'UIcon'].includes(c.pascalName))

		globals.forEach((c) => c.global = true)
	  }
	},
	experimental: {
		inlineSSRStyles: false
	},
	components: {
		dirs: ['~/components']
	},
	colorMode: {
		preference: 'dark',
		fallback: 'dark',
		storageKey: 'jl-docs-color-mode'
	},
	ui: {
	  icons: ['heroicons', 'simple-icons']
	},
	// Fonts
	fontMetrics: {
	  fonts: ['DM Sans']
	},
	googleFonts: {
	  display: 'swap',
	  download: true,
	  families: {
		Nunito:  [400, 500, 600, 700, 800, 900],
	  }
	},
	routeRules: {
	  '/api/search.json': { prerender: true },
	},
	// Devtools / Typescript
	devtools: { enabled: true },
	typescript: { strict: false },
	content: {
		defaultLocale: 'en',
		markdown: {
			mdc: true,
		},
		highlight: {
			preload: ['sql'],
		  }
	},
	nitro: {
		prerender: {
		  failOnError: false
		}
	}
  })
