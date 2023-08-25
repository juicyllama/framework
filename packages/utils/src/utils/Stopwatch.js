"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopwatch = void 0;
const Logger_1 = require("./Logger");
const logger = new Logger_1.Logger();
class Stopwatch {
    constructor(domain) {
        this._start = 0;
        this._end = 0;
        this._domain = '';
        this.seconds = 0;
        this._domain = domain;
    }
    start() {
        logger.log(`[${this._domain}][⏱️] Starting stopwatch`);
        this._start = performance.now();
    }
    check() {
        const now = performance.now();
        this.seconds = Number(((now - this._start) / 1000).toFixed(4));
        logger.log(`[${this._domain}][⏱️] Checking stopwatch: ${this.seconds}`);
        return this.seconds;
    }
    stop() {
        this._end = performance.now();
        this.seconds = Number(((this._end - this._start) / 1000).toFixed(4));
        const time = Number(((this._end - this._start) / 1000).toFixed(4));
        logger.log(`[${this._domain}][⏱️] Stopping stopwatch: ${time}`);
        this._start = 0;
        this._end = 0;
        this.seconds = 0;
        return time;
    }
}
exports.Stopwatch = Stopwatch;
