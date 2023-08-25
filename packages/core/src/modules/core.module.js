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
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const jwt_config_1 = __importDefault(require("../configs/jwt.config"));
const configs_1 = require("../configs");
const cache_config_1 = __importDefault(require("../configs/cache.config"));
const mongodb_config_1 = __importDefault(require("../configs/mongodb.config"));
const account_module_1 = require("./accounts/account.module");
const users_module_1 = require("./users/users.module");
const joi_1 = __importDefault(require("joi"));
const sso_config_joi_1 = require("../configs/sso.config.joi");
const utils_1 = require("@juicyllama/utils");
let CoreModule = exports.CoreModule = class CoreModule {
};
exports.CoreModule = CoreModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register((0, jwt_config_1.default)()),
            config_1.ConfigModule.forRoot({
                load: [mongodb_config_1.default, jwt_config_1.default, cache_config_1.default, configs_1.ssoConfig],
                isGlobal: true,
                envFilePath: '.env',
                validationSchema: utils_1.Env.IsNotTest() ? joi_1.default.object(Object.assign(Object.assign({}, configs_1.joiConfigJoi), sso_config_joi_1.ssoConfigJoi)) : null,
            }),
            common_1.CacheModule.registerAsync((0, cache_config_1.default)()),
            typeorm_1.TypeOrmModule.forRoot((0, configs_1.databaseConfig)()),
            typeorm_1.TypeOrmModule.forRootAsync((0, mongodb_config_1.default)()),
            (0, common_1.forwardRef)(() => account_module_1.AccountModule),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
        ],
        controllers: [],
        providers: [],
    })
], CoreModule);
//# sourceMappingURL=core.module.js.map