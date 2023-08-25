export let preset: string;
export let bail: boolean;
export let moduleFileExtensions: string[];
export let rootDir: string;
export let testRegex: string;
export let transform: {
    '^.+\\.(t|j)s$': string;
};
export let collectCoverageFrom: string[];
export let coverageDirectory: string;
export let testEnvironment: string;
export let moduleNameMapper: {
    '^@/(.*)$': string;
};
