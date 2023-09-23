module.exports = {
	extends: ['../.eslintrc.cjs', 'plugin:vue/essential', 'plugin:@typescript-eslint/recommended'],
	env: {
		browser: true,
		es2021: true,
	},
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	parser: 'vue-eslint-parser',
	plugins: [...require('../.eslintrc.cjs').plugins, 'vue'],
	rules: {
		...require('../.eslintrc.cjs').rules,
		'vue/require-valid-default-prop': 'off',
		'vue/no-mutating-props': 'off',
		'vue/multi-word-component-names': 'off',
		'vue/no-v-model-argument': 'off',
		'vue/no-multiple-template-root': 'off',
	},
}
