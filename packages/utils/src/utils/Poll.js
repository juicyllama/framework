"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poll = void 0;
const axios_1 = __importDefault(require("axios"));
const Logger_1 = require("./Logger");
const logger = new Logger_1.Logger();
class Poll {
    url(validate, url, config, interval = 2000, max_attempts = 10, domain, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!domain) {
                domain = 'common::poll::url';
            }
            const poll = () => {
                let attempts = 0;
                const executePoll = (resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    logger.debug(`[${domain}][${uuid}]} POLL #${attempts + 1}: ${url}`);
                    let result;
                    try {
                        result = yield axios_1.default.get(url, config);
                    }
                    catch (e) {
                        logger.warn(`[${domain}][${uuid}] POLL Error: ${e.message}`, {
                            error: {
                                message: e.message,
                                stack: e.stack,
                            },
                        });
                    }
                    logger.debug(`[${domain}][${uuid}]} POLL #${attempts + 1}: Response (${result.status})`, result.data);
                    attempts++;
                    if (validate(result.data)) {
                        return resolve(result.data);
                    }
                    else if (attempts === max_attempts) {
                        return reject('Exceeded max attempts');
                    }
                    else {
                        setTimeout(executePoll, interval, resolve, reject);
                    }
                });
                return new Promise(executePoll);
            };
            return poll()
                .then((result) => {
                return result;
            })
                .catch((error) => {
                throw Error(error);
            });
        });
    }
    function(validate, func, interval = 2000, max_attempts = 10, domain, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!domain) {
                domain = 'common::poll::function';
            }
            const poll = () => {
                let attempts = 0;
                const executePoll = (resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    logger.debug(`[${domain}][${uuid}]} POLL #${attempts + 1}`, {
                        func: func.toString(),
                        interval: interval,
                        max_attempts: max_attempts,
                        domain: domain,
                        uuid: uuid,
                    });
                    let result;
                    try {
                        result = yield func();
                    }
                    catch (e) {
                        logger.warn(`[${domain}][${uuid}] POLL Error: ${e.message}`, {
                            error: {
                                message: e.message,
                                stack: e.stack,
                            },
                        });
                    }
                    logger.debug(`[${domain}][${uuid}]} POLL #${attempts + 1}: Response`, {
                        result: result,
                        validate: validate.toString(),
                    });
                    attempts++;
                    if (validate(result)) {
                        return resolve(result);
                    }
                    else if (attempts === max_attempts) {
                        return reject('Exceeded max attempts');
                    }
                    else {
                        setTimeout(executePoll, interval, resolve, reject);
                    }
                });
                return new Promise(executePoll);
            };
            return poll()
                .then((result) => {
                return result;
            })
                .catch((e) => {
                logger.warn(`[${domain}][${uuid}] POLL Error: ${e.message}`, {
                    error: {
                        message: e.message,
                        stack: e.stack,
                    },
                });
            });
        });
    }
}
exports.Poll = Poll;
