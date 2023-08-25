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
exports.LocalStrategy = void 0;
const passport_local_1 = require("passport-local");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const users_service_1 = require("../../users/users.service");
let LocalStrategy = exports.LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(usersService, logger) {
        super({ usernameField: 'email' });
        this.usersService = usersService;
        this.logger = logger;
    }
    validate(email, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'utils::auth::login';
            this.logger.verbose(`[${domain}][${email}] Login request at ${new Date()}`);
            let user = yield this.usersService.validateUser(email, pass);
            if (user) {
                if (user.password_reset) {
                    this.logger.verbose(`[${domain}][${email}] Password requires changing`);
                    throw new common_1.ForbiddenException('Password requires changing');
                }
                this.logger.verbose(`[${domain}][${email}] Login Successful`);
                return user;
            }
            user = yield this.usersService.validateEmail(email);
            if (user) {
                if (user.password_reset) {
                    this.logger.verbose(`[${domain}][${email}] Password requires changing`);
                    throw new common_1.ForbiddenException('Password requires changing');
                }
            }
            this.logger.verbose(`[${domain}][${email}] No user found`);
            throw new common_1.UnauthorizedException();
        });
    }
};
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        utils_1.Logger])
], LocalStrategy);
//# sourceMappingURL=local.strategy.js.map