"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
class System {
    static isOffline() {
        return !!process.env.OFFLINE;
    }
}
exports.System = System;
