"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('beacon', () => ({
    SYSTEM_EMAIL_ADDRESS: process.env.SYSTEM_EMAIL_ADDRESS,
    SYSTEM_EMAIL_NAME: process.env.SYSTEM_EMAIL_NAME,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
    PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
    PUSHER_USE_TLS: process.env.PUSHER_USE_TLS,
    PUSHER_CHANNEL: process.env.PUSHER_CHANNEL,
}));
//# sourceMappingURL=beacon.config.js.map