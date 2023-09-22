module.exports = {
	extends: [
		'../.eslintrc.js',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
	},
	root: true,
	env: {
		node: true,
		jest: true,
	},
}
