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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const account_service_1 = require("../accounts/account.service");
const auth_service_1 = require("../auth/auth.service");
const baseService_1 = require("../../helpers/baseService");
const storage_service_1 = require("../storage/storage.service");
const storage_enums_1 = require("../storage/storage.enums");
const beacon_service_1 = require("../beacon/beacon.service");
const users_enums_1 = require("./users.enums");
const Query_1 = require("../../utils/typeorm/Query");
const users_hooks_1 = require("./users.hooks");
const users_constants_1 = require("./users.constants");
let UsersService = exports.UsersService = class UsersService extends baseService_1.BaseService {
    constructor(query, repository, logger, accountService, authService, beaconService, storageService, usersHooks) {
        super(query, repository, { beacon: beaconService });
        this.query = query;
        this.repository = repository;
        this.logger = logger;
        this.accountService = accountService;
        this.authService = authService;
        this.beaconService = beaconService;
        this.storageService = storageService;
        this.usersHooks = usersHooks;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.password) {
                data.password = utils_1.Security.hashPassword(data.password);
            }
            else {
                data.password = utils_1.Security.hashPassword('TMP_PASS_THAT_WONT_BE_USED');
            }
            const user = yield this.repository.create(data);
            return yield this.repository.save(user);
        });
    }
    invite(account, newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.findOneByEmail(newUser.email);
            if (user) {
                const account_exists = user.accounts.find(a => a.account_id === account.account_id);
                if (!account_exists) {
                    user.accounts.push(account);
                    yield this.usersHooks.account_added(account, user);
                    user = yield this.update(user);
                    yield this.authService.assignRole(user, account, users_enums_1.UserRole.VIEWER);
                }
                return user;
            }
            else {
                user = yield this.create(Object.assign(Object.assign({}, newUser), { accounts: [account] }));
                yield this.usersHooks.invited(account, user);
                delete user.password;
                return user;
            }
        });
    }
    findOneByEmail(email) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.findOne.call(this, { where: { email } });
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.password) {
                data.password = utils_1.Security.hashPassword(data.password);
            }
            yield this.repository.save(data);
            return yield this.query.findOneById(this.repository, data.user_id);
        });
    }
    uploadAvatar(user, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.storageService.write(`users/${user.user_id}/avatar/${file.originalname}`, storage_enums_1.StorageFileType.PUBLIC, storage_enums_1.StorageFileFormat.Express_Multer_File, file);
            if (result === null || result === void 0 ? void 0 : result.Location) {
                user = yield this.query.update(this.repository, {
                    user_id: user.user_id,
                    avatar_type: users_enums_1.UserAvatarType.IMAGE,
                    avatar_image_url: result.Location,
                });
            }
            return user;
        });
    }
    validateUser(email, pass) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                where: {
                    email: email,
                    password: utils_1.Security.hashPassword(pass),
                },
            };
            const user = yield _super.findOne.call(this, options);
            if (user) {
                delete user.password;
            }
            return user;
        });
    }
    validateEmail(email) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                email: email,
                deleted_at: null,
            };
            const options = {
                where: where,
            };
            const user = yield _super.findOne.call(this, options);
            if (user) {
                delete user.password;
            }
            return user;
        });
    }
    getValidatedUserByEmail(email) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield _super.findOne.call(this, {
                where: [{ email: email }],
            });
            this.authService.handleUserNotFoundException(user);
            user = yield this.authService.processGodUser(user);
            if (user) {
                delete user.password;
            }
            return user;
        });
    }
};
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(1, (0, typeorm_1.InjectRepository)(users_constants_1.E)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => account_service_1.AccountService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => beacon_service_1.BeaconService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => storage_service_1.StorageService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_hooks_1.UsersHooks))),
    __metadata("design:paramtypes", [Query_1.Query,
        typeorm_2.Repository,
        utils_1.Logger,
        account_service_1.AccountService,
        auth_service_1.AuthService,
        beacon_service_1.BeaconService,
        storage_service_1.StorageService,
        users_hooks_1.UsersHooks])
], UsersService);
//# sourceMappingURL=users.service.js.map