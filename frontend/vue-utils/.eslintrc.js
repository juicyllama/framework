module.exports = {
	ignorePatterns: ['/.github/*', '/cypress/*', '/dist'],
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier', 'prettier'],
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	parser: 'vue-eslint-parser',
	plugins: ['vue', '@typescript-eslint', 'prettier'],
	rules: {
		'no-unused-vars': 'off',
		'vue/require-valid-default-prop': 'off',
		'vue/no-mutating-props': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'vue/multi-word-component-names': 'off',
		'vue/no-v-model-argument': 'off',
	},
}
