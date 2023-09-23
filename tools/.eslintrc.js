module.exports = {
	extends: ['../.eslintrc.cjs', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
	},
	env: {
		node: true,
		jest: true,
	},
	plugins: [...require('../.eslintrc.cjs').plugins],
	rules: {
		...require('../.eslintrc.cjs').rules,
	},
}
