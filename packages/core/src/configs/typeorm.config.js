"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const database_config_1 = require("./database.config");
const utils_1 = require("@juicyllama/utils");
exports.default = new typeorm_1.DataSource(utils_1.Env.IsTest() ? database_config_1.TEST_DATABASE : database_config_1.DATABASE);
//# sourceMappingURL=typeorm.config.js.map