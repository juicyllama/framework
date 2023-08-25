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
exports.GoogleStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
const sso_config_joi_1 = require("../../../configs/sso.config.joi");
let GoogleStrategy = exports.GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(usersService) {
        var _a, _b;
        super({
            clientID: (_a = process.env.GOOGLE_CLIENT_ID) !== null && _a !== void 0 ? _a : sso_config_joi_1.defaultSSOString,
            clientSecret: (_b = process.env.GOOGLE_CLIENT_SECRET) !== null && _b !== void 0 ? _b : sso_config_joi_1.defaultSSOString,
            callbackURL: `${process.env.BASE_URL_APP}/login`,
            scope: ['email', 'profile'],
        });
        this.usersService = usersService;
    }
    validate(accessToken, refreshToken, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emails } = profile;
            return yield this.usersService.validateEmail(emails[0].value);
        });
    }
};
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map