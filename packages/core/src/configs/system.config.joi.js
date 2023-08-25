"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemConfigJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.systemConfigJoi = {
    SYSTEM_EMAIL_ADDRESS: joi_1.default.string().required(),
    SYSTEM_EMAIL_NAME: joi_1.default.string().required(),
    SYSTEM_DEFAULT_CURRENCY: joi_1.default.string().required(),
};
//# sourceMappingURL=system.config.joi.js.map