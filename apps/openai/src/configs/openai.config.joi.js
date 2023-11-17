"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiConfigJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.openaiConfigJoi = {
    OPENAI_API_KEY: joi_1.default.string().required(),
};
//# sourceMappingURL=openai.config.joi.js.map