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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const auth_service_1 = require("../auth/auth.service");
const account_service_1 = require("./account.service");
const AccountId_decorator_1 = require("../../decorators/AccountId.decorator");
const crud_decorator_1 = require("../../decorators/crud.decorator");
const account_dto_1 = require("./account.dto");
const account_entity_1 = require("./account.entity");
const account_enums_1 = require("./account.enums");
const TypeOrm_1 = require("../../utils/typeorm/TypeOrm");
const Query_1 = require("../../utils/typeorm/Query");
const UserAuth_decorator_1 = require("../../decorators/UserAuth.decorator");
const users_enums_1 = require("../users/users.enums");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("../users/users.service");
const E = account_entity_1.Account;
const NAME = 'account';
const SEARCH_FIELDS = ['account_name', 'company_name'];
const DEFAULT_ORDER_BY = 'account_name';
const PRIMARY_KEY = 'account_id';
let AccountController = exports.AccountController = class AccountController {
    constructor(authService, service, tQuery, usersService) {
        this.authService = authService;
        this.service = service;
        this.tQuery = tQuery;
        this.usersService = usersService;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.onboard(data);
        });
    }
    createAdditionalAccount(req, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.findById(req.user.user_id);
            return yield this.service.onboardAdditional(user, data);
        });
    }
    findAll(req, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = this.tQuery.buildWhere({
                repository: this.service.repository,
                query: query,
                account_ids: req.user.account_ids,
                search_fields: SEARCH_FIELDS,
            });
            const options = TypeOrm_1.TypeOrm.findOptions(query, where, DEFAULT_ORDER_BY);
            return yield this.service.findAll(options);
        });
    }
    stats(req, query, method) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!method) {
                method = utils_1.StatsMethods.COUNT;
            }
            if (method === utils_1.StatsMethods.AVG || method === utils_1.StatsMethods.SUM) {
                throw new common_1.BadRequestException(`Only option for this endpoint currently is COUNT`);
            }
            const where = this.tQuery.buildWhere({
                repository: this.service.repository,
                query: query,
                account_ids: req.user.account_ids,
                search_fields: SEARCH_FIELDS,
            });
            const options = {
                where: where,
            };
            switch (method) {
                case utils_1.StatsMethods.COUNT:
                    return {
                        count: yield this.service.count(options),
                    };
            }
        });
    }
    findOne(req, params, query) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.check(req.user.user_id, params[Number(PRIMARY_KEY)]);
            const where = {
                [PRIMARY_KEY]: params[PRIMARY_KEY],
            };
            const options = TypeOrm_1.TypeOrm.findOneOptions(query, where);
            return yield this.service.findOne(options);
        });
    }
    update(req, data, account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.check(req.user.user_id, account_id, [users_enums_1.UserRole.OWNER, users_enums_1.UserRole.ADMIN]);
            return yield this.service.update(Object.assign({ account_id: account_id }, data));
        });
    }
    uploadAvatarFile(req, file, account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.check(req.user.user_id, account_id, [users_enums_1.UserRole.OWNER, users_enums_1.UserRole.ADMIN]);
            if (!file) {
                throw new common_1.BadRequestException(`Missing required field: file`);
            }
            if (!Boolean(file.mimetype.match(/(jpg|jpeg|png|gif)/))) {
                throw new common_1.BadRequestException(`Not a valid jpg|jpeg|png|gif file`);
            }
            const account = yield this.service.findById(account_id);
            return yield this.service.uploadAvatar(account, file);
        });
    }
    transfer(req, account_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.check(req.user.user_id, account_id, [users_enums_1.UserRole.OWNER]);
            const account = yield this.service.findById(account_id);
            const user = yield this.usersService.findById(user_id);
            return {
                success: yield this.service.transfer(account, req.user, user),
            };
        });
    }
    close(req, account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.check(req.user.user_id, account_id, [users_enums_1.UserRole.OWNER, users_enums_1.UserRole.ADMIN]);
            const account = yield this.service.findById(account_id);
            return yield this.service.remove(account);
        });
    }
};
__decorate([
    (0, crud_decorator_1.CreateDecorator)(account_dto_1.SuccessAccountDto, NAME),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [account_dto_1.OnboardAccountDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "create", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, swagger_1.ApiOperation)({ summary: `Create Additional ${utils_1.Strings.capitalize(NAME)}` }),
    (0, common_1.Post)('additional'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, account_dto_1.OnboardAdditionalAccountDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "createAdditionalAccount", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, crud_decorator_1.ReadManyDecorator)(E, account_enums_1.AccountSelect, account_enums_1.AccountOrderBy, account_enums_1.AccountRelations, NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "findAll", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, crud_decorator_1.ReadStatsDecorator)(NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)('method')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "stats", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, crud_decorator_1.ReadOneDecorator)(E, PRIMARY_KEY, account_enums_1.AccountSelect, account_enums_1.AccountRelations, NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "findOne", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, crud_decorator_1.UpdateDecorator)(E, PRIMARY_KEY, NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, AccountId_decorator_1.AccountId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, account_dto_1.UpdateAccountDto, Number]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "update", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, swagger_1.ApiOperation)({ summary: `Upload ${utils_1.Strings.capitalize(NAME)} Avatar` }),
    (0, crud_decorator_1.UploadFileDecorator)(E),
    (0, common_1.Patch)(`avatar`),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, AccountId_decorator_1.AccountId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "uploadAvatarFile", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, swagger_1.ApiOperation)({ summary: `Transfer ${utils_1.Strings.capitalize(NAME)} Ownership` }),
    (0, swagger_1.ApiParam)({ name: 'user_id', description: 'User ID to transfer ownership to' }),
    (0, common_1.Post)(`transfer/:user_id`),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, AccountId_decorator_1.AccountId)()),
    __param(2, (0, common_1.Param)(':user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "transfer", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, swagger_1.ApiOperation)({ summary: `Close ${utils_1.Strings.capitalize(NAME)}` }),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, AccountId_decorator_1.AccountId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "close", null);
exports.AccountController = AccountController = __decorate([
    (0, swagger_1.ApiTags)(utils_1.Strings.capitalize(NAME)),
    (0, common_1.Controller)(`/${NAME}`),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => account_service_1.AccountService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        account_service_1.AccountService,
        Query_1.Query,
        users_service_1.UsersService])
], AccountController);
//# sourceMappingURL=account.controller.js.map