"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('mollie', () => ({
    MOLLIE_API_KEY: process.env.MOLLIE_API_KEY,
}));
//# sourceMappingURL=mollie.config.js.map