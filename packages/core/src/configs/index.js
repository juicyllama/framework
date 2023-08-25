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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssoConfig = exports.systemConfigJoi = exports.systemConfig = exports.typeormConfig = exports.mongodbConfig = exports.jwtConfig = exports.cacheConfig = exports.beaconConfig = void 0;
const beacon_config_1 = __importDefault(require("./beacon.config"));
exports.beaconConfig = beacon_config_1.default;
const cache_config_1 = __importDefault(require("./cache.config"));
exports.cacheConfig = cache_config_1.default;
const jwt_config_1 = __importDefault(require("./jwt.config"));
exports.jwtConfig = jwt_config_1.default;
const mongodb_config_1 = __importDefault(require("./mongodb.config"));
exports.mongodbConfig = mongodb_config_1.default;
const typeorm_config_1 = __importDefault(require("./typeorm.config"));
exports.typeormConfig = typeorm_config_1.default;
const system_config_1 = require("./system.config");
Object.defineProperty(exports, "systemConfig", { enumerable: true, get: function () { return system_config_1.systemConfig; } });
const system_config_joi_1 = require("./system.config.joi");
Object.defineProperty(exports, "systemConfigJoi", { enumerable: true, get: function () { return system_config_joi_1.systemConfigJoi; } });
const sso_config_1 = require("./sso.config");
Object.defineProperty(exports, "ssoConfig", { enumerable: true, get: function () { return sso_config_1.ssoConfig; } });
__exportStar(require("./aws.secrets"), exports);
__exportStar(require("./redoc.config"), exports);
__exportStar(require("./joi.config"), exports);
__exportStar(require("./nest.config"), exports);
__exportStar(require("./database.config"), exports);
__exportStar(require("./rabbitmq.config"), exports);
//# sourceMappingURL=index.js.map