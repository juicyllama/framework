import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	define: { 'process.env': process.env },
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			//fs: 'browserify-fs',
			path: 'path-browserify',
			os: 'os-browserify',
			crypto: 'crypto-browserify',
		},
	},
	plugins: [
		vue({
			template: {
				transformAssetUrls,
			},
		}),
		quasar(),
	],
	build: {
		target: 'modules',
		sourcemap: true,
		// Output compiled files to /dist.
		outDir: './dist',
		lib: {
			// Set the entry point (file that contains our components exported).
			entry: resolve(__dirname, 'src/index.ts'),
			// Name of the library.
			name: 'JLCore',
			// We are building for CJS and ESM, use a function to rename automatically files.
			// Example: my-components-library.esm.js
			fileName: format => `${'JLCore'}.${format}.js`,
		},
		rollupOptions: {
			external: [
				'@fortawesome/fontawesome-pro',
				//'@juicyllama/utils',
				'@quasar/extras',
				'chart.js',
				'chart.js/auto',
				'vue-chartjs',
				'vue3-autocounter',
				'axios',
				'boxicons',
				'dotenv',
				'javascript-time-ago',
				'pinia',
				'pusher-js',
				'quasar',
				'vue',
				'vue-router',
				'vue3-otp-input',
				'typeorm',
			],
			output: {
				globals: {
					vue: 'Vue',
					pinia: 'Pinia',
					//'@juicyllama/utils': 'JLUtils',
					'vue-router': 'vue-router',
					'vue3-otp-input': 'vue3-otp-input',
					'javascript-time-ago': 'javascript-time-ago',
					axios: 'axios',
					'chart.js': 'chart.js',
					'vue-chartjs': 'vue-chartjs',
					'vue3-autocounter': 'vue3-autocounter',
				},
				exports: 'named',
			},
		},
	},
	test: {
		environment: 'happy-dom',
		coverage: { provider: 'istanbul', reporter: ['text'] },
	},
	optimizeDeps: {
		exclude: ['/node_modules/@juicyllama/**/*'],
	},
})
