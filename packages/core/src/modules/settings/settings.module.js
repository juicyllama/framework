"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const settings_service_1 = require("./settings.service");
const settings_entity_1 = require("./settings.entity");
const utils_1 = require("@juicyllama/utils");
const configs_1 = require("../../configs");
const cache_config_1 = __importDefault(require("../../configs/cache.config"));
const config_1 = require("@nestjs/config");
const Query_1 = require("../../utils/typeorm/Query");
let SettingsModule = exports.SettingsModule = class SettingsModule {
};
exports.SettingsModule = SettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [cache_config_1.default, configs_1.databaseConfig],
                isGlobal: true,
                envFilePath: '.env',
            }),
            common_1.CacheModule.registerAsync((0, cache_config_1.default)()),
            typeorm_1.TypeOrmModule.forRoot((0, configs_1.databaseConfig)()),
            typeorm_1.TypeOrmModule.forFeature([settings_entity_1.Setting]),
        ],
        controllers: [],
        providers: [settings_service_1.SettingsService, utils_1.Logger, Query_1.Query],
        exports: [settings_service_1.SettingsService],
    })
], SettingsModule);
//# sourceMappingURL=settings.module.js.map