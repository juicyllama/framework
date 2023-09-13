module.exports = {
	preset: 'ts-jest',
	bail: true,
	moduleFileExtensions: ['ts', 'js', 'json'],
	rootDir: './',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node'
}
