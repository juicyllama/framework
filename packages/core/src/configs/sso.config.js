"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssoConfig = void 0;
const config_1 = require("@nestjs/config");
exports.ssoConfig = (0, config_1.registerAs)('sso', () => ({
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID,
}));
//# sourceMappingURL=sso.config.js.map