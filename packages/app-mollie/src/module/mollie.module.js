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
exports.MollieModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mollie_config_joi_1 = require("../config/mollie.config.joi");
const mollie_config_1 = __importDefault(require("../config/mollie.config"));
const utils_1 = require("@juicyllama/utils");
const joi_1 = __importDefault(require("joi"));
const customer_module_1 = require("./customer/customer.module");
const mandate_module_1 = require("./mandate/mandate.module");
const payment_module_1 = require("./payment/payment.module");
const mollie_service_1 = require("./mollie.service");
const core_1 = require("@juicyllama/core");
let MollieModule = exports.MollieModule = class MollieModule {
};
exports.MollieModule = MollieModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [mollie_config_1.default],
                validationSchema: process.env.NODE_ENV !== utils_1.Enviroment.test ? joi_1.default.object(mollie_config_joi_1.moillieConfigJoi) : null,
            }),
            (0, common_1.forwardRef)(() => core_1.AccountModule),
            (0, common_1.forwardRef)(() => customer_module_1.CustomerModule),
            (0, common_1.forwardRef)(() => mandate_module_1.MandateModule),
            (0, common_1.forwardRef)(() => payment_module_1.PaymentModule),
        ],
        controllers: [],
        providers: [mollie_service_1.MollieService, utils_1.Logger, core_1.Query],
        exports: [mollie_service_1.MollieService],
    })
], MollieModule);
//# sourceMappingURL=mollie.module.js.map