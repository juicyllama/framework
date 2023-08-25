"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Numbers = void 0;
class Numbers {
    static amountToCents(number) {
        const cents = (Number(number) * 100).toFixed(0);
        return Number(cents);
    }
    static toCurrency(number, currency) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        });
        return formatter.format(number);
    }
    static toFinancial(number) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formatter.format(number);
    }
}
exports.Numbers = Numbers;
