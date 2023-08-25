"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const middleware_1 = require("../../middleware");
const beacon_module_1 = require("../beacon/beacon.module");
const settings_module_1 = require("../settings/settings.module");
const tags_module_1 = require("../tags/tags.module");
const account_entity_1 = require("./account.entity");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const account_service_1 = require("./account.service");
const configs_1 = require("../../configs");
const utils_1 = require("@juicyllama/utils");
const Query_1 = require("../../utils/typeorm/Query");
const account_controller_1 = require("./account.controller");
const storage_module_1 = require("../storage/storage.module");
const account_hooks_1 = require("./account.hooks");
let AccountModule = exports.AccountModule = class AccountModule {
    configure(consumer) {
        consumer.apply(middleware_1.MiddlewareAccountId);
    }
};
exports.AccountModule = AccountModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register((0, configs_1.jwtConfig)()),
            typeorm_1.TypeOrmModule.forRoot((0, configs_1.databaseConfig)()),
            typeorm_1.TypeOrmModule.forFeature([account_entity_1.Account]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => beacon_module_1.BeaconModule),
            (0, common_1.forwardRef)(() => settings_module_1.SettingsModule),
            (0, common_1.forwardRef)(() => storage_module_1.StorageModule),
            (0, common_1.forwardRef)(() => tags_module_1.TagsModule),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
        ],
        controllers: [account_controller_1.AccountController],
        providers: [account_service_1.AccountService, account_hooks_1.AccountHooks, utils_1.Logger, Query_1.Query],
        exports: [account_service_1.AccountService],
    })
], AccountModule);
//# sourceMappingURL=account.module.js.map