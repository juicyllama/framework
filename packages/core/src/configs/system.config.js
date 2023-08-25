"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemConfig = void 0;
const config_1 = require("@nestjs/config");
exports.systemConfig = (0, config_1.registerAs)('system', () => ({
    SYSTEM_DEFAULT_CURRENCY: process.env.SYSTEM_DEFAULT_CURRENCY,
    SYSTEM_EMAIL_ADDRESS: process.env.SYSTEM_EMAIL_ADDRESS,
    SYSTEM_EMAIL_NAME: process.env.SYSTEM_EMAIL_NAME,
}));
//# sourceMappingURL=system.config.js.map