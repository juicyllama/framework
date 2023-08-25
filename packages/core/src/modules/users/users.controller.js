"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const users_dto_1 = require("./users.dto");
const users_enums_1 = require("./users.enums");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../auth/auth.service");
const account_service_1 = require("../accounts/account.service");
const users_service_1 = require("./users.service");
const decorators_1 = require("../../decorators");
const Query_1 = require("../../utils/typeorm/Query");
const users_constants_1 = require("./users.constants");
const helpers_1 = require("../../helpers");
const crud_decorator_1 = require("../../decorators/crud.decorator");
const crudController_1 = require("../../helpers/crudController");
const csv_service_1 = require("../csv/csv.service");
const storage_service_1 = require("../storage/storage.service");
let UsersController = exports.UsersController = class UsersController {
    constructor(authService, accountService, tQuery, service, storageService, csvService) {
        this.authService = authService;
        this.accountService = accountService;
        this.tQuery = tQuery;
        this.service = service;
        this.storageService = storageService;
        this.csvService = csvService;
    }
    create(req, account_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.check(req.user.user_id, account_id, [users_enums_1.UserRole.OWNER, users_enums_1.UserRole.ADMIN]);
            const account = yield this.accountService.findById(account_id);
            return yield this.service.invite(account, data);
        });
    }
    findAll(req, account_id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield (0, helpers_1.crudFindAll)({
                service: this.service,
                tQuery: this.tQuery,
                account_id: account_id,
                query: query,
                searchFields: users_constants_1.SEARCH_FIELDS,
                order_by: users_constants_1.DEFAULT_ORDER_BY,
            });
            for (const u in users) {
                delete users[u].password;
            }
            return users;
        });
    }
    stats(req, account_id, query, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, helpers_1.crudStats)({
                service: this.service,
                tQuery: this.tQuery,
                account_id: account_id,
                query: query,
                method: method,
                searchFields: users_constants_1.SEARCH_FIELDS,
            });
        });
    }
    charts(req, query, search, from, to, fields, period) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, crudController_1.crudCharts)(Object.assign(Object.assign(Object.assign({ service: this.service, tQuery: this.tQuery, query,
                search,
                period,
                fields }, (from && { from: new Date(from) })), (to && { to: new Date(to) })), { searchFields: users_constants_1.SEARCH_FIELDS }));
        });
    }
    findOne(req, account_id, params, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, helpers_1.crudFindOne)({
                service: this.service,
                query: query,
                primaryKey: params[users_constants_1.PRIMARY_KEY],
            });
            delete user.password;
            return user;
        });
    }
    update(req, account_id, data, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = req.user;
            if (params[users_constants_1.PRIMARY_KEY] !== req.user.user_id) {
                yield this.authService.check(req.user.user_id, account_id, [users_enums_1.UserRole.OWNER, users_enums_1.UserRole.ADMIN]);
                user = yield this.service.findById(params[users_constants_1.PRIMARY_KEY]);
                if (!user) {
                    throw new common_1.BadRequestException(`User #${params[users_constants_1.PRIMARY_KEY]} not found`);
                }
            }
            delete user.password;
            return yield this.service.update(Object.assign(Object.assign({}, user), data));
        });
    }
    uploadAvatarFile(req, file, account_id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                throw new common_1.BadRequestException(`Missing required field: file`);
            }
            if (!Boolean(file.mimetype.match(/(jpg|jpeg|png|gif)/))) {
                throw new common_1.BadRequestException(`Not a valid jpg|jpeg|png|gif file`);
            }
            let user = req.user;
            if (params[users_constants_1.PRIMARY_KEY] !== req.user.user_id) {
                yield this.authService.check(req.user.user_id, account_id, [users_enums_1.UserRole.OWNER, users_enums_1.UserRole.ADMIN]);
                user = yield this.service.findById(params[users_constants_1.PRIMARY_KEY]);
                if (!user) {
                    throw new common_1.BadRequestException(`User #${params[users_constants_1.PRIMARY_KEY]} not found`);
                }
            }
            else {
                user = yield this.service.findById(req.user.user_id);
            }
            return yield this.service.uploadAvatar(user, file);
        });
    }
    uploadCSVFile(req, file, account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.check(req.user.user_id, account_id, [users_enums_1.UserRole.OWNER, users_enums_1.UserRole.ADMIN]);
            return yield (0, crudController_1.crudUploadCSV)(file, users_constants_1.CSV_FIELDS, {
                service: this.service,
                csvService: this.csvService,
            });
        });
    }
    update_role(req, account_id, params, role) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.check(req.user.user_id, account_id, [users_enums_1.UserRole.OWNER, users_enums_1.UserRole.ADMIN]);
            const account = yield this.accountService.findById(account_id);
            const user = yield this.service.findById(params[users_constants_1.PRIMARY_KEY]);
            return yield this.authService.assignRole(user, account, role);
        });
    }
    remove(req, account_id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.check(req.user.user_id, account_id, [users_enums_1.UserRole.OWNER, users_enums_1.UserRole.ADMIN]);
            return yield (0, helpers_1.crudDelete)({
                service: this.service,
                primaryKey: params[users_constants_1.PRIMARY_KEY],
            });
        });
    }
};
__decorate([
    (0, decorators_1.CreateDecorator)(users_constants_1.E, users_constants_1.NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, decorators_1.AccountId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, users_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, decorators_1.ReadManyDecorator)(users_constants_1.E, users_enums_1.UserSelect, users_enums_1.UserOrderBy, users_enums_1.UserRelations, users_constants_1.NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, decorators_1.AccountId)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, decorators_1.ReadStatsDecorator)(users_constants_1.NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, decorators_1.AccountId)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Query)('method')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "stats", null);
__decorate([
    (0, crud_decorator_1.ReadChartsDecorator)(users_constants_1.E, users_enums_1.UserSelect, users_constants_1.NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __param(5, (0, common_1.Query)('fields')),
    __param(6, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, Array, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "charts", null);
__decorate([
    (0, decorators_1.ReadOneDecorator)(users_constants_1.E, users_constants_1.PRIMARY_KEY, users_enums_1.UserSelect, users_enums_1.UserRelations, users_constants_1.NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, decorators_1.AccountId)()),
    __param(2, (0, common_1.Param)()),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, decorators_1.UpdateDecorator)(users_constants_1.E, users_constants_1.PRIMARY_KEY, users_constants_1.NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, decorators_1.AccountId)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, users_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Upload ${utils_1.Strings.capitalize(users_constants_1.NAME)} Avatar` }),
    (0, decorators_1.UploadFileDecorator)(users_constants_1.E),
    (0, common_1.Patch)(`:user_id/avatar`),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, decorators_1.AccountId)()),
    __param(3, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadAvatarFile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Upload ${utils_1.Strings.capitalize(users_constants_1.NAME)}s CSV File` }),
    (0, crud_decorator_1.UploadCSVDecorator)(),
    (0, common_1.Post)(`upload_csv`),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, decorators_1.AccountId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadCSVFile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Update ${utils_1.Strings.capitalize(users_constants_1.NAME)} Role` }),
    (0, swagger_1.ApiParam)({ name: users_constants_1.PRIMARY_KEY }),
    (0, swagger_1.ApiQuery)({
        name: 'role',
        type: 'string',
        enum: users_enums_1.UserRole,
        description: 'Role to assign to user',
        required: true,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: `OK`,
        type: users_constants_1.E,
    }),
    (0, common_1.Patch)(`:user_id/role`),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, decorators_1.AccountId)()),
    __param(2, (0, common_1.Param)()),
    __param(3, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update_role", null);
__decorate([
    (0, decorators_1.DeleteDecorator)(users_constants_1.E, users_constants_1.PRIMARY_KEY, users_constants_1.NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, decorators_1.AccountId)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)(utils_1.Strings.capitalize(utils_1.Strings.plural(users_constants_1.NAME))),
    (0, decorators_1.UserAuth)(),
    (0, common_1.Controller)(`/${utils_1.Strings.plural(users_constants_1.NAME)}`),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => account_service_1.AccountService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => storage_service_1.StorageService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => csv_service_1.CsvService))),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        account_service_1.AccountService,
        Query_1.Query,
        users_service_1.UsersService,
        storage_service_1.StorageService,
        csv_service_1.CsvService])
], UsersController);
//# sourceMappingURL=users.controller.js.map