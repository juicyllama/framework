const eslint = require('./.eslintrc.js')
const prettier = require('./.prettierrc.js')
const jestConfig = require('./jest.config.js')
module.exports = { eslint, prettier, jestConfig }

// TSconfig not able to import into package.json yet - https://github.com/microsoft/TypeScript/issues/32830
