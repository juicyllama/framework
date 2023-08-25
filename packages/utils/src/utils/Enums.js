"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enums = void 0;
class Enums {
    static getKeyName(anEnum, value) {
        return Object.keys(anEnum)[Object.values(anEnum).indexOf(value)];
    }
    static toArray(Enum, key_name, pair_name) {
        if (!Enum || !Object.keys(Enum).length) {
            return [];
        }
        const arr = [];
        Object.keys(Enum).forEach((key) => {
            arr.push({
                [key_name]: key,
                [pair_name]: Enum[key],
            });
        });
        if (Object.keys(Enum)[0] === Object.values(Enum)[0]) {
            return arr;
        }
        const half = Math.ceil(arr.length / 2);
        return arr.slice(half);
    }
}
exports.Enums = Enums;
