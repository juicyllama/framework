import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	define: { 'process.env': process.env },
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	plugins: [vue()],
	build: {
		sourcemap: true,
		outDir: './dist',
		lib: {
			// Set the entry point (file that contains our components exported).
			entry: resolve(__dirname, 'src/index.ts'),
			// Name of the library.
			name: 'JLUtils',
			// We are building for CJS and ESM, use a function to rename automatically files.
			// Example: my-component-library.esm.js
			fileName: (format) => `${'JLUtils'}.${format}.js`,
		},
		rollupOptions: {
			external: [
				'vue',
				'/src/**/.*', //trying to exclude src files from making it into npm release
			],
			output: { globals: { vue: 'Vue' } },
		},
	},
	optimizeDeps: {
		exclude: ['/node_modules/@juicyllama/**/*'],
	},
})
