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
exports.UsersHooks = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const config_1 = require("@nestjs/config");
const beacon_service_1 = require("../beacon/beacon.service");
let UsersHooks = exports.UsersHooks = class UsersHooks {
    constructor(configService, beaconService) {
        this.configService = configService;
        this.beaconService = beaconService;
    }
    invited(account, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = `🎉 You are invited to join ${account.account_name} on ${utils_1.Strings.capitalize(this.configService.get(`PROJECT_NAME`))}`;
            const markdown = `${user.first_name}, you have been invited to join ${account.account_name}'s account on ${utils_1.Strings.capitalize(this.configService.get(`PROJECT_NAME`))}!
		
You can [set your password here](${this.configService.get(`APP_BASE_URL`)}/reset).`;
            yield this.beaconService.notify({
                methods: {
                    email: true,
                },
                communication: {
                    email: {
                        to: {
                            email: user.email,
                            name: user.name,
                        },
                    },
                },
                subject: subject,
                markdown: markdown,
                json: {},
            });
        });
    }
    account_added(account, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = `🎉 You've joined ${account.account_name} on ${utils_1.Strings.capitalize(this.configService.get(`PROJECT_NAME`))}`;
            const markdown = `${user.first_name}, ${account.account_name} has added you to their account on ${utils_1.Strings.capitalize(this.configService.get(`PROJECT_NAME`))}!
		
You can [login here](${this.configService.get(`APP_BASE_URL`)}/login) with your existing credentials.`;
            yield this.beaconService.notify({
                methods: {
                    email: true,
                },
                communication: {
                    email: {
                        to: {
                            email: user.email,
                            name: user.name,
                        },
                    },
                },
                subject: subject,
                markdown: markdown,
                json: {},
            });
        });
    }
};
exports.UsersHooks = UsersHooks = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => config_1.ConfigService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => beacon_service_1.BeaconService))),
    __metadata("design:paramtypes", [config_1.ConfigService,
        beacon_service_1.BeaconService])
], UsersHooks);
//# sourceMappingURL=users.hooks.js.map