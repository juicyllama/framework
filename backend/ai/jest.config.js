module.exports = {
	bail: true,
	roots: ['<rootDir>'],
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.ts'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
}
