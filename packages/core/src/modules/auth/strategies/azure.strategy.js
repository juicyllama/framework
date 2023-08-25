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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureADGuard = exports.AzureADStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_azure_ad_1 = require("passport-azure-ad");
const sso_config_joi_1 = require("../../../configs/sso.config.joi");
const AZURE_AD_CLIENT_ID = (_a = process.env.AZURE_AD_CLIENT_ID) !== null && _a !== void 0 ? _a : sso_config_joi_1.defaultSSOString;
const AZURE_AD_TENANT_ID = (_b = process.env.AZURE_AD_TENANT_ID) !== null && _b !== void 0 ? _b : sso_config_joi_1.defaultSSOString;
let AzureADStrategy = exports.AzureADStrategy = class AzureADStrategy extends (0, passport_1.PassportStrategy)(passport_azure_ad_1.BearerStrategy, 'azure-ad') {
    constructor() {
        super({
            identityMetadata: `https://login.microsoftonline.com/${AZURE_AD_TENANT_ID}/v2.0/.well-known/openid-configuration`,
            clientID: AZURE_AD_CLIENT_ID,
        });
    }
    validate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return data;
        });
    }
};
exports.AzureADStrategy = AzureADStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AzureADStrategy);
exports.AzureADGuard = (0, passport_1.AuthGuard)('azure-ad');
//# sourceMappingURL=azure.strategy.js.map