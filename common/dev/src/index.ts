import * as eslint from './.eslintrc.js'
import * as prettier from './.prettierrc.js'
import * as jestConfig from './jest.config.js'

export { eslint, prettier, jestConfig }

// TSconfig not able to import into package.json yet - https://github.com/microsoft/TypeScript/issues/32830
