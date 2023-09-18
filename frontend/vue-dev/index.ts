const eslint = require('./.eslintrc.js')
const prettier = require('./.prettierrc.js')
const vitest = require('./vitest.config.js')
module.exports = { eslint, prettier, vitest }

// TSconfig not able to import into package.json yet - https://github.com/microsoft/TypeScript/issues/32830
