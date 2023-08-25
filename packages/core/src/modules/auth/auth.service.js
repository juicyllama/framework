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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const role_entity_1 = require("./role.entity");
const account_service_1 = require("../accounts/account.service");
const settings_service_1 = require("../settings/settings.service");
const jwt_1 = require("@nestjs/jwt");
const helpers_1 = require("../../helpers");
const Query_1 = require("../../utils/typeorm/Query");
const beacon_service_1 = require("../beacon/beacon.service");
const login_dto_1 = require("./dtos/login.dto");
const auth_constants_1 = require("./auth.constants");
const users_enums_1 = require("../users/users.enums");
const E = role_entity_1.Role;
let AuthService = exports.AuthService = class AuthService extends helpers_1.BaseService {
    constructor(query, repository, logger, accountService, beaconService, settingsService, usersService, jwtService, cacheManager) {
        super(query, repository, { beacon: beaconService });
        this.query = query;
        this.repository = repository;
        this.logger = logger;
        this.accountService = accountService;
        this.beaconService = beaconService;
        this.settingsService = settingsService;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.cacheManager = cacheManager;
    }
    assignRole(user, account, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'core::auth::service::assignRole';
            let userRole = yield this.getRole(user.user_id, account.account_id);
            if (!userRole) {
                userRole = yield this.create({
                    user_id: user.user_id,
                    account_id: account.account_id,
                    role: role,
                });
            }
            else {
                userRole = yield this.update({
                    role_id: userRole.role_id,
                    role: role,
                });
            }
            if (user.roles) {
                user.roles.push(userRole);
                user.roles = [...new Map(user.roles.map(item => [item['role_id'], item])).values()];
            }
            else {
                user.roles = [userRole];
            }
            user = yield this.usersService.update(user);
            this.logger.debug(`[${domain}] User #${user.user_id} is now a ${role} of account #${account.account_id}!`);
            return user;
        });
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield this.constructLoginPayload(user);
            if (!['development', 'test'].includes(process.env.NODE_ENV)) {
                let Bugsnag;
                if (utils_1.Modules.isInstalled('@bugsnag/js')) {
                    Bugsnag = require('@bugsnag/js');
                    Bugsnag.setUser(user.user_id, user.email);
                }
            }
            user.last_login_at = new Date();
            delete user.password;
            yield this.usersService.update(user);
            return new login_dto_1.LoginResponseDto(this.jwtService.sign(payload, { secret: process.env.JWT_KEY }));
        });
    }
    constructLoginPayload(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.accounts) {
                throw new common_1.ImATeapotException(`Missing accounts on login payload, go grab a cuppa while you seek help!`);
            }
            return {
                email: user.email,
                user_id: user.user_id,
                account_ids: yield this.getAccountIds(user),
            };
        });
    }
    initiatePasswordReset(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.findOneByEmail(data.email);
            this.handleUserNotFoundException(user);
            const code = yield this.generateVerificationCodeAndSavetoRedis(user);
            yield this.sendVerificationCode(user, code);
            return !!user.user_id;
        });
    }
    completePasswordReset(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.findOneByEmail(data.email);
            this.handleUserNotFoundException(user);
            const verificationCode = yield this.getValidationCode(user);
            if (this.verificationCodeIsInvalid(verificationCode, data.code)) {
                throw new common_1.BadRequestException('', 'Your verification code is invalid or expired, please generate a new verification code');
            }
            user.password = data.newPassword;
            user.password_reset = false;
            yield this.usersService.update(user);
            this.logger.log(`[CACHE][DELETE] USER_${user.user_id}_VALIDATION_CODE`);
            yield this.cacheManager.del(`USER_${user.user_id}_VALIDATION_CODE`);
            return new login_dto_1.LoginResponseDto(this.jwtService.sign(yield this.constructLoginPayload(user), { secret: process.env.JWT_KEY }));
        });
    }
    initiatePasswordlessLogin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.findOneByEmail(data.email);
            this.handleUserNotFoundException(user);
            const code = yield this.generateVerificationCodeAndSavetoRedis(user);
            yield this.sendLoginCode(user, code);
            return !!user.user_id;
        });
    }
    validateVerificationCode(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.findOneByEmail(data.email);
            this.handleUserNotFoundException(user);
            const verificationCode = yield this.getValidationCode(user);
            if (this.verificationCodeIsInvalid(verificationCode, data.code)) {
                throw new common_1.BadRequestException('', 'Your verification code is invalid or expired, please generate a new verification code');
            }
            return {
                success: !!user.user_id,
            };
        });
    }
    getValidationCode(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache_key = utils_1.JLCache.cacheKey(auth_constants_1.AUTH_CODE, { user_id: user.user_id });
            const result = yield this.cacheManager.get(cache_key);
            this.logger.log(`[CACHE][GET] ${cache_key} = `, result);
            return result;
        });
    }
    validateLoginCodeAndLogin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.findOneByEmail(data.email);
            this.handleUserNotFoundException(user);
            const verificationCode = yield this.getValidationCode(user);
            if (this.verificationCodeIsInvalid(verificationCode, data.code)) {
                throw new common_1.BadRequestException('', 'Your login code is invalid or expired, please generate a new verification code');
            }
            const cache_key = utils_1.JLCache.cacheKey(auth_constants_1.AUTH_CODE, { user_id: user.user_id });
            this.logger.log(`[CACHE][DELETE] ${cache_key}`);
            yield this.cacheManager.del(cache_key);
            return new login_dto_1.LoginResponseDto(this.jwtService.sign(yield this.constructLoginPayload(user), { secret: process.env.JWT_KEY }));
        });
    }
    handleUserNotFoundException(user) {
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    verificationCodeIsInvalid(verificationCode, code) {
        return !verificationCode || !(code == verificationCode);
    }
    sendVerificationCode(user, code) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'accounts::auth::sendVerificationCode';
            const subject = `🔑 Reset Password`;
            let markdown = `Hi ${(_a = user.first_name) !== null && _a !== void 0 ? _a : 'there'}, <br><br> You recently requested to reset the password for your ${utils_1.Strings.capitalize(process.env.npm_package_name)} account. Use the code below to change your password \n`;
            markdown += `### ${code} \n`;
            markdown += `If you did not request a password reset, please ignore this email. This password reset code is only valid for the next 20 minutes.`;
            const result = yield this.beaconService.notify({
                subject: subject,
                methods: {
                    email: true,
                },
                communication: {
                    email: {
                        to: {
                            email: user.email,
                            name: (_b = user.first_name) !== null && _b !== void 0 ? _b : 'there',
                        },
                    },
                },
                markdown: markdown,
                cta: {
                    text: `One-Click Reset`,
                    url: `${process.env.BASE_URL_APP}/password/reset?code=${code}`,
                },
                json: {},
            });
            this.logger.log(`[${domain}] Email sent to ${user.email} with subject: ${subject}`, result);
        });
    }
    sendLoginCode(user, code) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'accounts::auth::sendLoginCode';
            const subject = `🔑 Login Code`;
            let markdown = `Hi ${(_a = user.first_name) !== null && _a !== void 0 ? _a : 'there'}, <br><br> You recently requested passwordless login for your ${utils_1.Strings.capitalize(process.env.npm_package_name)} account. Use the code below to login: \n`;
            markdown += ` ### ${code} \n`;
            markdown += `This login code is only valid for the next 20 minutes.`;
            const result = yield this.beaconService.notify({
                methods: {
                    email: true,
                },
                communication: {
                    email: {
                        to: {
                            email: user.email,
                            name: (_b = user.first_name) !== null && _b !== void 0 ? _b : 'there',
                        },
                    },
                },
                subject: subject,
                markdown: markdown,
                cta: {
                    text: `One-Click Login`,
                    url: `${process.env.BASE_URL_APP}/passwordless?code=${code}`,
                },
                json: {},
            });
            this.logger.log(`[${domain}] Email sent to ${user.email} with subject: ${subject}`, result);
        });
    }
    generateVerificationCodeAndSavetoRedis(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const verificationCode = utils_1.OTP.generateVerificationCode(6);
            const cache_key = utils_1.JLCache.cacheKey(auth_constants_1.AUTH_CODE, { user_id: user.user_id });
            this.logger.log(`[CACHE][SET] ${cache_key} = ${verificationCode}`);
            yield this.cacheManager.set(cache_key, verificationCode, utils_1.CachePeriod.TWENTY);
            return yield this.cacheManager.get(cache_key);
        });
    }
    clearUserAuthCache(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let cache_key = utils_1.JLCache.cacheKey(auth_constants_1.AUTH_ACCOUNT_IDS, { user_id: user.user_id });
            yield this.cacheManager.del(cache_key);
            for (const account of user.accounts) {
                cache_key = utils_1.JLCache.cacheKey(auth_constants_1.AUTH_ACCOUNT_ROLE, { user_id: user.user_id, account_id: account.account_id });
                yield this.cacheManager.del(cache_key);
            }
        });
    }
    isGodUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const GOD_DOMAINS = yield this.settingsService.findValue('GOD_DOMAINS');
            return !!(GOD_DOMAINS && GOD_DOMAINS.includes(user.email.split('@')[1]));
        });
    }
    getGodUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const GOD_DOMAINS = yield this.settingsService.findValue('GOD_DOMAINS');
            return yield this.usersService.findAll({
                where: {
                    email: (0, typeorm_2.In)(GOD_DOMAINS.map(d => (0, typeorm_2.Like)(`%${d}`))),
                },
            });
        });
    }
    getAccountIds(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isGodUser(user)) {
                const accounts = yield this.accountService.findAll({
                    take: 99999999,
                });
                return accounts.map(a => a.account_id);
            }
            const cache_key = utils_1.JLCache.cacheKey(auth_constants_1.AUTH_ACCOUNT_IDS, { user_id: user.user_id });
            if (utils_1.Env.useCache()) {
                const result = yield this.cacheManager.get(cache_key);
                if (result) {
                    return result;
                }
            }
            if (!user || !user.accounts || user.accounts.length === 0) {
                throw new common_1.UnauthorizedException(`No accounts found for user #${user.user_id}`);
            }
            const account_ids = user.accounts.map(a => a.account_id);
            if (utils_1.Env.useCache()) {
                yield this.cacheManager.set(cache_key, account_ids, utils_1.CachePeriod.DAY);
            }
            return account_ids;
        });
    }
    getUserRole(user_id, account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache_key = utils_1.JLCache.cacheKey(auth_constants_1.AUTH_ACCOUNT_ROLE, { user_id: user_id, account_id: account_id });
            if (utils_1.Env.useCache()) {
                const result = yield this.cacheManager.get(cache_key);
                if (result) {
                    return result;
                }
            }
            const user = yield this.usersService.findById(user_id);
            if (yield this.isGodUser(user)) {
                if (utils_1.Env.useCache()) {
                    yield this.cacheManager.set(cache_key, users_enums_1.UserRole.OWNER, utils_1.CachePeriod.DAY);
                }
                return users_enums_1.UserRole.OWNER;
            }
            if (account_id) {
                const permission = yield this.getRole(user_id, account_id);
                if (permission) {
                    if (utils_1.Env.useCache()) {
                        yield this.cacheManager.set(cache_key, permission.role, utils_1.CachePeriod.DAY);
                    }
                    return permission.role;
                }
            }
            let role_value = users_enums_1.UserRoleNum.VIEWER;
            const permissions = yield this.getRoles(user_id);
            if (!permissions) {
                if (utils_1.Env.useCache()) {
                    yield this.cacheManager.set(cache_key, users_enums_1.UserRoleNum.VIEWER, utils_1.CachePeriod.DAY);
                }
                return users_enums_1.UserRoleNum.VIEWER;
            }
            for (const permission of permissions) {
                if (users_enums_1.UserRoleNum[permission.role] > role_value)
                    role_value = users_enums_1.UserRoleNum[permission.role];
            }
            const user_role = users_enums_1.UserRole[utils_1.Enums.getKeyName(users_enums_1.UserRoleNum, role_value)];
            if (utils_1.Env.useCache()) {
                yield this.cacheManager.set(cache_key, user_role, utils_1.CachePeriod.DAY);
            }
            return user_role;
        });
    }
    getRole(user_id, account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOne({
                where: {
                    user: {
                        user_id: user_id,
                    },
                    account: {
                        account_id: account_id,
                    },
                },
            });
        });
    }
    getRoles(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find({
                where: {
                    user: {
                        user_id: user_id,
                    },
                },
            });
        });
    }
    check(user_id, account_id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            if (account_id) {
                const user = yield this.usersService.findById(user_id);
                const user_account_ids = yield this.getAccountIds(user);
                if (!user_account_ids.includes(account_id)) {
                    this.logger.warn(`Permission denied`, {
                        user_account_ids: user_account_ids,
                        account_id: account_id,
                        user_id: user_id,
                        roles: roles,
                    });
                    yield this.clearUserAuthCache(user);
                    throw new common_1.UnauthorizedException(`User does not have access to account_id #${account_id}`);
                }
            }
            if (roles) {
                const role = yield this.getUserRole(user_id, account_id);
                if (!roles.includes(role)) {
                    throw new common_1.ForbiddenException(`${role} role does not have access to this endpoint`);
                }
            }
        });
    }
    referrerCheck(referrer, allowed, domain) {
        if (utils_1.Env.IsProd()) {
            if (!referrer) {
                this.logger.warn(`[${domain}] No referrer found`, {
                    NODE_ENV: process.env.NODE_ENV,
                    allowed: allowed,
                });
                throw new common_1.UnauthorizedException();
            }
            const referrer_url = new URL(referrer);
            if (referrer_url.origin !== allowed) {
                this.logger.error(`[${domain}] Referrer does not match`, {
                    referrer: referrer_url,
                    allowed: allowed,
                    NODE_ENV: process.env.NODE_ENV,
                });
                throw new common_1.UnauthorizedException();
            }
        }
        return true;
    }
    processGodUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isGodUser(user)) {
                user.accounts = yield this.accountService.findAll({
                    take: 99999999,
                });
                const roles = [];
                for (const account of user.accounts) {
                    roles.push({
                        user_id: user.user_id,
                        account_id: account.account_id,
                        role: users_enums_1.UserRole.OWNER,
                    });
                }
                user.roles = roles;
            }
            return user;
        });
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(1, (0, typeorm_1.InjectRepository)(E)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => account_service_1.AccountService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => beacon_service_1.BeaconService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => settings_service_1.SettingsService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => jwt_1.JwtService))),
    __param(8, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Query_1.Query,
        typeorm_2.Repository,
        utils_1.Logger,
        account_service_1.AccountService,
        beacon_service_1.BeaconService,
        settings_service_1.SettingsService,
        users_service_1.UsersService,
        jwt_1.JwtService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map