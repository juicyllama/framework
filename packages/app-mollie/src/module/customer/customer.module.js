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
exports.CustomerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("./customer.entity");
const customer_service_1 = require("./customer.service");
const config_1 = require("@nestjs/config");
const mollie_config_1 = __importDefault(require("../../config/mollie.config"));
const utils_1 = require("@juicyllama/utils");
const joi_1 = __importDefault(require("joi"));
const mollie_config_joi_1 = require("../../config/mollie.config.joi");
const core_1 = require("@juicyllama/core");
let CustomerModule = exports.CustomerModule = class CustomerModule {
};
exports.CustomerModule = CustomerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([customer_entity_1.MollieCustomer]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [mollie_config_1.default],
                validationSchema: process.env.NODE_ENV !== utils_1.Enviroment.test ? joi_1.default.object(mollie_config_joi_1.moillieConfigJoi) : null,
            }),
        ],
        controllers: [],
        providers: [customer_service_1.CustomerService, utils_1.Logger, core_1.Query],
        exports: [customer_service_1.CustomerService],
    })
], CustomerModule);
//# sourceMappingURL=customer.module.js.map