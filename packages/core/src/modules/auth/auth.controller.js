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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const login_dto_1 = require("./dtos/login.dto");
const password_reset_dto_1 = require("./dtos/password.reset.dto");
const users_entity_1 = require("../users/users.entity");
const passwordless_login_dto_1 = require("./dtos/passwordless.login.dto");
const decorators_1 = require("../../decorators");
const auth_service_1 = require("./auth.service");
const utils_1 = require("@juicyllama/utils");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const users_service_1 = require("../users/users.service");
const passport_1 = require("@nestjs/passport");
const decorators_2 = require("../../decorators");
const azure_strategy_1 = require("./strategies/azure.strategy");
let AuthController = exports.AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authService.login(req.user);
        });
    }
    getProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersService.validateEmail(req.user.email);
        });
    }
    initiatePasswordReset(req, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                success: yield this.authService.initiatePasswordReset(data),
            };
        });
    }
    validateVerificationCode(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authService.validateVerificationCode(data);
        });
    }
    completePasswordReset(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authService.completePasswordReset(data);
        });
    }
    initiatePasswordLessLogin(req, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                success: yield this.authService.initiatePasswordlessLogin(data),
            };
        });
    }
    validateCodeAndLogin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authService.validateLoginCodeAndLogin(data);
        });
    }
    initiateGoogleLogin() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    googleAuthRedirect(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authService.login(req.user);
        });
    }
    initiateAzureLogin() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    azureAuthRedirect(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authService.login(req.user);
        });
    }
    accountCheck(req, account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.findById(req.user.user_id);
            const account_ids = yield this.authService.getAccountIds(user);
            return {
                passed: account_ids.includes(account_id),
            };
        });
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Login',
        description: 'Posting the users email and password if successfully authenticated will return a token. Pass this bearer token in the `Authorization header (Authorization: Bearer {TOKEN})` to access restricted endpoints.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'email', required: true, type: String, example: 'richard.branson@fly.virgin.com' }),
    (0, swagger_1.ApiQuery)({ name: 'password', required: true, type: String, example: 'S7r0#gP@$s' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OK',
        type: login_dto_1.LoginResponseDto,
    }),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, decorators_1.UserAuth)({ skipAccountId: true }),
    (0, swagger_1.ApiOperation)({
        summary: 'Profile',
        description: 'Test your bearer token here to confirm its all working ok.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OK',
        type: users_entity_1.User,
    }),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Password Reset - Start',
        description: "Pass the user's email address to initiate the password reset process",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OK',
        type: utils_1.SuccessResponseDto,
    }),
    (0, common_1.Post)('password-reset'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, password_reset_dto_1.InitiateResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "initiatePasswordReset", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Password Reset - Code',
        description: "Optional - This endpoint takes the code sent to the user's email as the input and validates it",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OK',
        type: users_entity_1.User,
    }),
    (0, common_1.Post)('password-reset/code'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.ValidateCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateVerificationCode", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Password Reset - Complete',
        description: 'Updates user password and returns the access_token once reset',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OK',
        type: login_dto_1.LoginResponseDto,
    }),
    (0, common_1.Post)('password-reset/complete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_reset_dto_1.CompletePasswordResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completePasswordReset", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Passwordless - Start',
        description: "Pass the user's email address to initiate the passwordless login process",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OK',
        type: utils_1.SuccessResponseDto,
    }),
    (0, common_1.Post)('passwordless'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, passwordless_login_dto_1.InitiatePasswordlessLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "initiatePasswordLessLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Passwordless - Code',
        description: "This endpoint takes the code sent to the user's email as the input, validates it and  if successful, the user is authenticated and a token is returned",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OK',
        type: login_dto_1.LoginResponseDto,
    }),
    (0, common_1.Post)('passwordless/code'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.ValidateCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateCodeAndLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Google Login - Start',
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, common_1.Get)('google'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "initiateGoogleLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Google Login - Complete',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OK',
        type: login_dto_1.LoginResponseDto,
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, common_1.Get)('google/redirect'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Azure AD Login - Start',
    }),
    (0, common_1.UseGuards)(azure_strategy_1.AzureADGuard),
    (0, common_1.Get)('azure_ad'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "initiateAzureLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Azure AD Login - Complete',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OK',
        type: login_dto_1.LoginResponseDto,
    }),
    (0, common_1.UseGuards)(azure_strategy_1.AzureADGuard),
    (0, common_1.Get)('azure_ad/redirect'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "azureAuthRedirect", null);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, decorators_1.UserAuth)(),
    (0, common_1.Get)('account/check'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, decorators_2.AccountId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "accountCheck", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('/auth'),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map