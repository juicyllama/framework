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
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const beacon_service_1 = require("../beacon/beacon.service");
const account_entity_1 = require("./account.entity");
const utils_1 = require("@juicyllama/utils");
const baseService_1 = require("../../helpers/baseService");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Query_1 = require("../../utils/typeorm/Query");
const storage_service_1 = require("../storage/storage.service");
const storage_enums_1 = require("../storage/storage.enums");
const auth_service_1 = require("../auth/auth.service");
const users_service_1 = require("../users/users.service");
const users_enums_1 = require("../users/users.enums");
const account_hooks_1 = require("./account.hooks");
const E = account_entity_1.Account;
let AccountService = exports.AccountService = class AccountService extends baseService_1.BaseService {
    constructor(query, repository, logger, authService, beaconService, storageService, usersService, accountHooks) {
        super(query, repository, { beacon: beaconService });
        this.query = query;
        this.repository = repository;
        this.logger = logger;
        this.authService = authService;
        this.beaconService = beaconService;
        this.storageService = storageService;
        this.usersService = usersService;
        this.accountHooks = accountHooks;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'core::account::service::create';
            this.logger.warn(`[${domain}] Application needs to use onboard and not create`, data);
            throw new common_1.BadRequestException(`Use onboard instead of create`);
        });
    }
    onboard(data) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'core::account::service::onboard';
            const account_data = {
                account_name: data.account_name,
                currency: (_b = (_a = data.currency) !== null && _a !== void 0 ? _a : utils_1.SupportedCurrencies[process.env.SYSTEM_DEFAULT_CURRENCY]) !== null && _b !== void 0 ? _b : utils_1.SupportedCurrencies.USD,
            };
            const account = yield _super.create.call(this, account_data);
            let user = yield this.usersService.findOneByEmail(data.owners_email);
            if (!user) {
                const onboardOwner = {
                    email: data.owners_email,
                    password: data.owners_password,
                    first_name: data.owners_first_name,
                    last_name: data.owners_last_name,
                    password_reset: false,
                    accounts: [account],
                };
                user = yield this.usersService.create(onboardOwner);
                user = yield this.authService.assignRole(user, account, users_enums_1.UserRole.OWNER);
                this.logger.debug(`[${domain}] New account owner created`, user);
            }
            else {
                this.logger.debug(`[${domain}] New account created by existing user`, user);
                user.accounts.push(account);
                user = yield this.usersService.update(user);
                user = yield this.authService.assignRole(user, account, users_enums_1.UserRole.OWNER);
                yield this.authService.clearUserAuthCache(user);
            }
            yield this.accountHooks.Created(account, user);
            delete user.password;
            return {
                account: account,
                owner: user,
            };
        });
    }
    onboardAdditional(user, data) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'core::account::service::onboardAdditional';
            const account_data = {
                account_name: data.account_name,
                currency: (_b = (_a = data.currency) !== null && _a !== void 0 ? _a : utils_1.SupportedCurrencies[process.env.SYSTEM_DEFAULT_CURRENCY]) !== null && _b !== void 0 ? _b : utils_1.SupportedCurrencies.USD,
            };
            const account = yield _super.create.call(this, account_data);
            this.logger.debug(`[${domain}] New account created by existing user`, {
                user: user,
                account: account,
            });
            user.accounts.push(account);
            user = yield this.usersService.update(user);
            user = yield this.authService.assignRole(user, account, users_enums_1.UserRole.OWNER);
            yield this.authService.clearUserAuthCache(user);
            yield this.accountHooks.Created(account, user);
            delete user.password;
            return {
                account: account,
                owner: user,
            };
        });
    }
    uploadAvatar(account, file) {
        const _super = Object.create(null, {
            update: { get: () => super.update }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.storageService.write(`accounts/${account.account_id}/avatar/${file.originalname}`, storage_enums_1.StorageFileType.PUBLIC, storage_enums_1.StorageFileFormat.Express_Multer_File, file);
            if (result === null || result === void 0 ? void 0 : result.Location) {
                account.avatar_image_url = result.Location;
                account = yield _super.update.call(this, account);
                return account;
            }
            this.logger.error(`Error saving avatar`, {
                account: account,
                result: result,
            });
        });
    }
    transfer(account, old_owner, new_owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const new_owner_role = yield this.authService.assignRole(new_owner, account, users_enums_1.UserRole.OWNER);
            const old_owner_role = yield this.authService.assignRole(old_owner, account, users_enums_1.UserRole.ADMIN);
            return !!(new_owner_role.user_id && old_owner_role.user_id);
        });
    }
    getOwner(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.authService.findOne({
                where: {
                    account: {
                        account_id: account.account_id,
                    },
                    role: users_enums_1.UserRole.OWNER,
                },
            });
            return role.user;
        });
    }
    remove(account) {
        const _super = Object.create(null, {
            remove: { get: () => super.remove }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.remove.call(this, account);
        });
    }
};
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(1, (0, typeorm_1.InjectRepository)(E)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => beacon_service_1.BeaconService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => storage_service_1.StorageService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => account_hooks_1.AccountHooks))),
    __metadata("design:paramtypes", [Query_1.Query,
        typeorm_2.Repository,
        utils_1.Logger,
        auth_service_1.AuthService,
        beacon_service_1.BeaconService,
        storage_service_1.StorageService,
        users_service_1.UsersService,
        account_hooks_1.AccountHooks])
], AccountService);
//# sourceMappingURL=account.service.js.map