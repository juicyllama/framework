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
exports.MiddlewareAccountId = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const auth_service_1 = require("../modules/auth/auth.service");
const account_service_1 = require("../modules/accounts/account.service");
let MiddlewareAccountId = exports.MiddlewareAccountId = class MiddlewareAccountId {
    constructor(accountService, authService, logger) {
        this.accountService = accountService;
        this.authService = authService;
        this.logger = logger;
    }
    use(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const account_id = (req === null || req === void 0 ? void 0 : req.headers) && req.headers['account-id'] ? req.headers['account-id'] : (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.account_id;
            const user_id = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.user_id;
            if (user_id && account_id) {
                yield this.authService.check(req.user.user_id, account_id);
                let Bugsnag;
                if (utils_1.Modules.isInstalled('@bugsnag/js')) {
                    Bugsnag = require('@bugsnag/js');
                    Bugsnag.addMetadata('account', yield this.accountService.findById(req.query.account_id));
                    Bugsnag.addMetadata('user', req.user);
                }
            }
            next();
        });
    }
};
exports.MiddlewareAccountId = MiddlewareAccountId = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => account_service_1.AccountService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __metadata("design:paramtypes", [account_service_1.AccountService,
        auth_service_1.AuthService,
        utils_1.Logger])
], MiddlewareAccountId);
//# sourceMappingURL=AuthCheck.js.map