"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('jwt', () => ({
    secret: process.env.JWT_KEY,
    signOptions: { expiresIn: '1d' },
}));
//# sourceMappingURL=jwt.config.js.map