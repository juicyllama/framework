"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Functions = void 0;
class Functions {
    static whoIsMyDaddy() {
        const ex = new Error();
        return ex.stack.split('\n')[3].trim().split(' ')[1];
    }
}
exports.Functions = Functions;
