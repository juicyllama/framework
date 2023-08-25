"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitMQConfig = exports.RABBITMQ = void 0;
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.RABBITMQ = {
    RABBIT_MQ_URI: process.env.RABBIT_MQ_URI,
};
exports.rabbitMQConfig = (0, config_1.registerAs)('rabbitmq', () => exports.RABBITMQ);
//# sourceMappingURL=rabbitmq.config.js.map