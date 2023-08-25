"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moillieConfigJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.moillieConfigJoi = {
    MOLLIE_API_KEY: joi_1.default.string().required(),
};
//# sourceMappingURL=mollie.config.joi.js.map