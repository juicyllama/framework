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
exports.OpenaiModule = void 0;
const config_1 = require("@nestjs/config");
const utils_1 = require("@juicyllama/utils");
const openai_service_1 = require("./openai.service");
const joi_1 = __importDefault(require("joi"));
const utils_2 = require("@juicyllama/utils");
const common_1 = require("@nestjs/common");
const openai_config_1 = __importDefault(require("../configs/openai.config"));
const openai_config_joi_1 = require("../configs/openai.config.joi");
let OpenaiModule = class OpenaiModule {
};
exports.OpenaiModule = OpenaiModule;
exports.OpenaiModule = OpenaiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [openai_config_1.default],
                isGlobal: true,
                envFilePath: '.env',
                validationSchema: process.env.NODE_ENV !== utils_1.Enviroment.test ? joi_1.default.object(openai_config_joi_1.openaiConfigJoi) : null,
            }),
        ],
        controllers: [],
        providers: [openai_service_1.OpenaiService, utils_2.Logger, utils_1.Api],
        exports: [openai_service_1.OpenaiService],
    })
], OpenaiModule);
//# sourceMappingURL=openai.module.js.map