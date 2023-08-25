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
exports.CsvModule = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const cache_config_1 = __importDefault(require("../../configs/cache.config"));
const config_1 = require("@nestjs/config");
const csv_service_1 = require("./csv.service");
let CsvModule = exports.CsvModule = class CsvModule {
};
exports.CsvModule = CsvModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [cache_config_1.default],
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        providers: [csv_service_1.CsvService, utils_1.Logger],
        exports: [csv_service_1.CsvService],
    })
], CsvModule);
//# sourceMappingURL=csv.module.js.map