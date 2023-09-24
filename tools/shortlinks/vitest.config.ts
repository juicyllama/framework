import { defineProject, mergeConfig } from 'vitest/config'
import configShared from '../../vitest.config.js'

export default mergeConfig(
	configShared,
	defineProject({
		test: {
			root: './src',
		},
	}),
)
