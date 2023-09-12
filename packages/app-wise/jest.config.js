const config = {
	preset: 'ts-jest',
	bail: true,
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: './',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
}

module.exports = config
