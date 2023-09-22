module.exports = {
	root: true,
	plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
	rules: {
		'prettier/prettier': 'warn',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/ban-types': 'off',
	},
	ignorePatterns: [
		'.eslintrc.js',
		'node_modules',
		'test',
		'dist',
		'logs',
		'db',
		'**/*spec.ts',
		'**/*.mocks.ts',
		'**/*.test.spec.ts',
		'**/*.test.paused.ts',
		'**/*.test.config.ts',
		'/.github/*',
		'/cypress/*'
	],
}
