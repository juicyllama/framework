const config = {
	preset: 'ts-jest',
	bail: true,
	moduleFileExtensions: ['ts', 'js', 'json'],
	rootDir: process.cwd(),
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	testPathIgnorePatterns: ['/dist/', '/node_modules/'],
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^@api/(.*)$': '<rootDir>/apps/api/src/$1',
		'^@common/(.*)$': '<rootDir>/libs/common/src/$1',
		'^@juicyllama/core': '<rootDir>/src/index.ts',
	},
	testTimeout: 60000,
	fakeTimers: {
		enableGlobally: true,
	},
}

module.exports = config
