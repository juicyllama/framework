"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssoConfigJoi = exports.defaultSSOString = void 0;
const joi_1 = __importDefault(require("joi"));
exports.defaultSSOString = 'TODO';
exports.ssoConfigJoi = {
    FACEBOOK_APP_ID: joi_1.default.string().default(exports.defaultSSOString),
    FACEBOOK_APP_SECRET: joi_1.default.string().default(exports.defaultSSOString),
    GOOGLE_CLIENT_ID: joi_1.default.string().default(exports.defaultSSOString),
    GOOGLE_CLIENT_SECRET: joi_1.default.string().default(exports.defaultSSOString),
    AZURE_AD_CLIENT_ID: joi_1.default.string().default(exports.defaultSSOString),
    AZURE_AD_TENANT_ID: joi_1.default.string().default(exports.defaultSSOString),
};
//# sourceMappingURL=sso.config.joi.js.map