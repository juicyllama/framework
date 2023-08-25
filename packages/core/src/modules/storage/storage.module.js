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
exports.StorageModule = void 0;
const common_1 = require("@nestjs/common");
const storage_service_1 = require("./storage.service");
const utils_1 = require("@juicyllama/utils");
const cache_config_1 = __importDefault(require("../../configs/cache.config"));
const config_1 = require("@nestjs/config");
const Query_1 = require("../../utils/typeorm/Query");
let StorageModule = exports.StorageModule = class StorageModule {
};
exports.StorageModule = StorageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            common_1.CacheModule.registerAsync((0, cache_config_1.default)()),
        ],
        providers: [storage_service_1.StorageService, utils_1.Logger, Query_1.Query],
        exports: [storage_service_1.StorageService],
    })
], StorageModule);
//# sourceMappingURL=storage.module.js.map