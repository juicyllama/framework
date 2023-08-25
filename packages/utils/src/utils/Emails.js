"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emails = void 0;
class Emails {
    static maskEmail(email) {
        const [name, domain] = email.split('@');
        const lengthName = name.length;
        const lengthEmail = domain.length;
        let maskedName = '';
        let maskedDomain = '';
        if (lengthName > 2) {
            maskedName = name[0] + '***' + name[lengthName - 1];
        }
        else {
            maskedName = name;
        }
        if (lengthEmail > 6) {
            maskedDomain =
                domain[0] +
                    '***' +
                    domain[lengthEmail - 5] +
                    domain[lengthEmail - 4] +
                    domain[lengthEmail - 3] +
                    domain[lengthEmail - 2] +
                    domain[lengthEmail - 1];
        }
        else {
            maskedName = domain;
        }
        return maskedName + '@' + maskedDomain;
    }
}
exports.Emails = Emails;
