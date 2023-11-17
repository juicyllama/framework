"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('openai', () => ({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
}));
//# sourceMappingURL=openai.config.js.map