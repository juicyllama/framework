module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	bail: true,
	detectOpenHandles: true,
	forceExit: true,
	rootDir: 'src',
	testRegex: [/.*\.spec\.ts$/],
	transform: {
		'^.+\\.{ts|tsx}?$': [
			'ts-jest',
			{
				babel: true,
				tsConfig: 'tsconfig.json',
				isolatedModules: true,
			},
		],
	},
}