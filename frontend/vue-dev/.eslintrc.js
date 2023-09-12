module.exports = {
	"ignorePatterns": ["/node_modules", "/dist", "/.github/*", "/cypress/*"],
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		// "eslint:recommended",
		"plugin:vue/essential",
		"plugin:@typescript-eslint/recommended"
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"parser": "@typescript-eslint/parser",
		"sourceType": "module"
	},
	"parser": "vue-eslint-parser",
	"plugins": [
		"vue",
		"prettier",
		"@typescript-eslint"
	],
	"overrides": [
		{
			"files": [
				"**/*.test.spec.{j,t}s?(x)"
			],
			"env": {
				"jest": true
			}
		}
	],
	"rules": {
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/ban-types': 'off',
		'vue/require-valid-default-prop': 'off',
		'vue/no-mutating-props': 'off',
		'vue/no-multiple-template-root': 'off',
		'vue/multi-word-component-names': 'off',
		'vue/no-v-model-argument': 'off',
		'vue/no-v-text-v-html-on-component': 'off',
        'vue/no-setup-props-destructure': 'off',
	}
}
