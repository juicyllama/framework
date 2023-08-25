"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modules = void 0;
class Modules {
    static isInstalled(name) {
        try {
            const p = require.resolve(name);
            return !!p;
        }
        catch (e) {
            return false;
        }
    }
}
exports.Modules = Modules;
