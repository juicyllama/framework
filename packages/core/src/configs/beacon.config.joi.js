"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.beaconConfigJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.beaconConfigJoi = {
    SYSTEM_EMAIL_ADDRESS: joi_1.default.string(),
    SYSTEM_EMAIL_NAME: joi_1.default.string(),
    PUSHER_APP_ID: joi_1.default.string(),
    PUSHER_APP_KEY: joi_1.default.string(),
    PUSHER_APP_SECRET: joi_1.default.string(),
    PUSHER_APP_CLUSTER: joi_1.default.string(),
    PUSHER_USE_TLS: joi_1.default.boolean().default(true),
    PUSHER_CHANNEL: joi_1.default.string(),
};
//# sourceMappingURL=beacon.config.joi.js.map