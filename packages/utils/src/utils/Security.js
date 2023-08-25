"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Security = void 0;
const env_1 = require("../enums/env");
const crypto_1 = require("crypto");
class Security {
    static hashPassword(password) {
        if (!password) {
            throw new Error('Password is empty');
        }
        if (password.length === 128) {
            return password;
        }
        return (0, crypto_1.createHash)('sha512').update(password).digest('hex');
    }
    static referrerCheck(referrer, domain) {
        if (env_1.Enviroment[process.env.NODE_ENV] === env_1.Enviroment.production) {
            if (!referrer) {
                throw new Error('Unauthorized');
            }
            const referrer_url = new URL(referrer);
            if (referrer_url.origin !== domain) {
                throw new Error('Unauthorized');
            }
        }
        return true;
    }
}
exports.Security = Security;
