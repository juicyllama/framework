var eslint = require('./.eslintrc.js');
var prettier = require('./.prettierrc.js');
var jestConfig = require('./jest.config.js');
module.exports = { eslint: eslint, prettier: prettier, jestConfig: jestConfig };
// TSconfig not able to import into package.json yet - https://github.com/microsoft/TypeScript/issues/32830
