"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joiConfigJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.joiConfigJoi = {
    NODE_ENV: joi_1.default.string().required(),
    TZ: joi_1.default.string().default('UTC'),
    REDIS_HOST: joi_1.default.string().required(),
    REDIS_PORT: joi_1.default.number().default(6379),
    REDIS_PASSWORD: joi_1.default.string(),
    MYSQL_HOSTNAME: joi_1.default.string().required(),
    MYSQL_PORT: joi_1.default.number().default(3306),
    MYSQL_USERNAME: joi_1.default.string().required(),
    MYSQL_PASSWORD: joi_1.default.string().required(),
    MYSQL_DB_NAME: joi_1.default.string().required(),
    MONGODB_HOSTNAME: joi_1.default.string(),
    MONGODB_PORT: joi_1.default.number().default(27017),
    MONGODB_DATABASE: joi_1.default.string(),
};
//# sourceMappingURL=joi.config.js.map