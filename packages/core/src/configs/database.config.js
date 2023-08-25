"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = exports.TEST_DATABASE = exports.DATABASE = void 0;
const config_1 = require("@nestjs/config");
const naming_strategy_1 = require("../utils/typeorm/naming.strategy");
const utils_1 = require("@juicyllama/utils");
const path = __importStar(require("path"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.DATABASE = {
    type: 'mysql',
    host: process.env.MYSQL_HOSTNAME,
    port: +process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    entities: [
        path.resolve(process.cwd(), 'dist', '**', '*.entity.{ts,js}'),
        path.resolve(process.cwd(), 'node_modules', '@juicyllama', '**', '*.entity.{ts,js}'),
    ],
    autoLoadEntities: true,
    synchronize: false,
    migrationsRun: true,
    migrations: [path.resolve(process.cwd(), 'dist', 'db', 'migrations', '*.{ts,js}')],
    cli: { migrationsDir: path.resolve(process.cwd(), 'db', 'migrations') },
    namingStrategy: new naming_strategy_1.CustomNamingStrategy(),
    keepConnectionAlive: true,
};
exports.TEST_DATABASE = {
    type: 'mysql',
    host: process.env.MYSQL_HOSTNAME,
    port: +process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_TEST_NAME,
    entities: [path.resolve(process.cwd(), '**', '*.entity.{ts,js}')],
    autoLoadEntities: true,
    synchronize: true,
    namingStrategy: new naming_strategy_1.CustomNamingStrategy(),
    keepConnectionAlive: true,
};
exports.databaseConfig = (0, config_1.registerAs)('database', () => {
    return utils_1.Env.IsTest() ? exports.TEST_DATABASE : exports.DATABASE;
});
//# sourceMappingURL=database.config.js.map