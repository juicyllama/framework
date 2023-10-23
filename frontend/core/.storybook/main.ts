/** @type { import('@storybook/vue3-vite').StorybookConfig } */
import { resolve } from 'path'
import { mergeConfig } from 'vite';

const config = {
	// stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts)'],
	stories: ['../src/stories/UploadButton.stories.js'],
	// addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
	typescript: { reactDocgen: false,  check: true, skipBabel: true, },
	framework: {
		name: '@storybook/vue3-vite',
		options: {
			builder: {
				viteConfigPath: './vite.config.ts',
				// entry: resolve(__dirname, './src/app.ts'),
			  },
			// builder: {
			// 	resolve: {
			// 		alias: {
			// 			'@': resolve(__dirname, 'src'),
			// 		},
			// 	},
			// }
		},
	},
	docs: {
		autodocs: 'tag',
	},
}
export default config
