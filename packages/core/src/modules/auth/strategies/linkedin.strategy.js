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
exports.LinkedinStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_linkedin_oauth2_1 = require("passport-linkedin-oauth2");
const users_service_1 = require("../../users/users.service");
let LinkedinStrategy = exports.LinkedinStrategy = class LinkedinStrategy extends (0, passport_1.PassportStrategy)(passport_linkedin_oauth2_1.Strategy, 'linkedin') {
    constructor(usersService) {
        super({
            clientID: process.env.LINKEDIN_KEY,
            clientSecret: process.env.LINKEDIN_SECRET,
            callbackURL: `${process.env.BASE_URL_APP}/login`,
            scope: ['r_emailaddress', 'r_liteprofile'],
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
exports.LinkedinStrategy = LinkedinStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], LinkedinStrategy);
//# sourceMappingURL=linkedin.strategy.js.map