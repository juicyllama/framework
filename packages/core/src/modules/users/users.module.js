"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const storage_module_1 = require("../storage/storage.module");
const auth_module_1 = require("../auth/auth.module");
const users_service_1 = require("./users.service");
const users_hooks_1 = require("./users.hooks");
const configs_1 = require("../../configs");
const users_entity_1 = require("./users.entity");
const utils_1 = require("@juicyllama/utils");
const Query_1 = require("../../utils/typeorm/Query");
const beacon_module_1 = require("../beacon/beacon.module");
const account_module_1 = require("../accounts/account.module");
const users_controller_1 = require("./users.controller");
const middleware_1 = require("../../middleware");
const csv_module_1 = require("../csv/csv.module");
let UsersModule = exports.UsersModule = class UsersModule {
    configure(consumer) {
        consumer.apply(middleware_1.MiddlewareAccountId);
    }
};
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register((0, configs_1.jwtConfig)()),
            typeorm_1.TypeOrmModule.forRoot((0, configs_1.databaseConfig)()),
            typeorm_1.TypeOrmModule.forFeature([users_entity_1.User]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => account_module_1.AccountModule),
            (0, common_1.forwardRef)(() => beacon_module_1.BeaconModule),
            (0, common_1.forwardRef)(() => storage_module_1.StorageModule),
            (0, common_1.forwardRef)(() => csv_module_1.CsvModule),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, users_hooks_1.UsersHooks, utils_1.Logger, Query_1.Query],
        exports: [users_service_1.UsersService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map