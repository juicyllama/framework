"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = void 0;
const dailing_codes_json_1 = __importDefault(require("../assets/dailing_codes.json"));
const Strings_1 = require("./Strings");
class Phone {
    static internationalCode(iso2) {
        const code = dailing_codes_json_1.default[iso2].dialling_code;
        return Strings_1.Strings.onlyNumbers(code);
    }
}
exports.Phone = Phone;
