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
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const cache_config_1 = __importDefault(require("../../configs/cache.config"));
const configs_1 = require("../../configs");
const passport_1 = require("@nestjs/passport");
const users_module_1 = require("../users/users.module");
const account_module_1 = require("../accounts/account.module");
const local_strategy_1 = require("./strategies/local.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const role_entity_1 = require("./role.entity");
const auth_service_1 = require("./auth.service");
const cron_strategy_1 = require("./strategies/cron.strategy");
const basic_strategy_1 = require("./strategies/basic.strategy");
const google_strategy_1 = require("./strategies/google.strategy");
const azure_strategy_1 = require("./strategies/azure.strategy");
const utils_1 = require("@juicyllama/utils");
const Query_1 = require("../../utils/typeorm/Query");
const beacon_module_1 = require("../beacon/beacon.module");
const settings_module_1 = require("../settings/settings.module");
const auth_controller_1 = require("./auth.controller");
const middleware_1 = require("../../middleware");
const joi_1 = __importDefault(require("joi"));
const sso_config_joi_1 = require("../../configs/sso.config.joi");
let AuthModule = exports.AuthModule = class AuthModule {
    configure(consumer) {
        consumer.apply(middleware_1.MiddlewareAccountId);
    }
};
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [cache_config_1.default, configs_1.jwtConfig, configs_1.databaseConfig, configs_1.ssoConfig],
                isGlobal: true,
                envFilePath: '.env',
                validationSchema: utils_1.Env.IsNotTest() ? joi_1.default.object(sso_config_joi_1.ssoConfigJoi) : null,
            }),
            common_1.CacheModule.registerAsync((0, cache_config_1.default)()),
            jwt_1.JwtModule.register((0, configs_1.jwtConfig)()),
            typeorm_1.TypeOrmModule.forRoot((0, configs_1.databaseConfig)()),
            typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role]),
            (0, common_1.forwardRef)(() => account_module_1.AccountModule),
            (0, common_1.forwardRef)(() => beacon_module_1.BeaconModule),
            (0, common_1.forwardRef)(() => passport_1.PassportModule),
            (0, common_1.forwardRef)(() => settings_module_1.SettingsModule),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
            cron_strategy_1.CronStrategy,
            basic_strategy_1.BasicStrategy,
            google_strategy_1.GoogleStrategy,
            azure_strategy_1.AzureADStrategy,
            utils_1.Logger,
            Query_1.Query,
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map