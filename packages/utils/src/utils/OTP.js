"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
class OTP {
    static generateVerificationCode(length) {
        const characters = '0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
exports.OTP = OTP;
