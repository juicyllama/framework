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
exports.Api = void 0;
const axios_1 = __importDefault(require("axios"));
const Logger_1 = require("./Logger");
const logger = new Logger_1.Logger();
class Api {
    get(domain, url, config, uuid, interceptor) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!config) {
                config = this.defaultConfig();
            }
            try {
                logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (GET): ${url}`);
                let response;
                if (interceptor) {
                    const client = axios_1.default.create();
                    client.interceptors.request.use(interceptor);
                    response = yield client.get(url, config);
                }
                else {
                    response = yield axios_1.default.get(url, config);
                }
                logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status} length=${((_a = response.data) === null || _a === void 0 ? void 0 : _a.length) || 0}`);
                logger.verbose(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response data`, response.data);
                return response.data;
            }
            catch (e) {
                return this.processError(e, 'GET', url, domain, config, null, uuid);
            }
        });
    }
    post(domain, url, data, config, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config) {
                config = this.defaultConfig();
            }
            try {
                logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Request (POST): ${url}`, data);
                const response = yield axios_1.default.post(url, data, config);
                logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status}`, response.data);
                return response.data;
            }
            catch (e) {
                return this.processError(e, 'POST', url, domain, config, data, uuid);
            }
        });
    }
    patch(domain, url, data, config, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config) {
                config = this.defaultConfig();
            }
            try {
                logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (PATCH): ${url}`, data);
                const response = yield axios_1.default.patch(url, data, config);
                logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status}`, response.data);
                return response.data;
            }
            catch (e) {
                return this.processError(e, 'PATCH', url, domain, config, data, uuid);
            }
        });
    }
    put(domain, url, data, config, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config) {
                config = this.defaultConfig();
            }
            try {
                logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (PUT): ${url}`, data);
                const response = yield axios_1.default.put(url, data, config);
                logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status}`, response.data);
                return response.data;
            }
            catch (e) {
                return this.processError(e, 'PUT', url, domain, config, data, uuid);
            }
        });
    }
    delete(domain, url, config, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config) {
                config = this.defaultConfig();
            }
            try {
                logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (DELETE): ${url}`);
                const response = yield axios_1.default.delete(url, config);
                logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status}`, response.data);
                return true;
            }
            catch (e) {
                return this.processError(e, 'DELETE', url, domain, config, null, uuid);
            }
        });
    }
    defaultConfig() {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json',
            },
        };
    }
    processError(e, method, url, domain, config, data, uuid) {
        console.log(e);
        console.log(logger);
        const message = `[${domain}]${uuid ? '[' + uuid + ']' : ''} Error (${e.response && e.response.status ? e.response.status : null}): ${e.message}`;
        const debug = {
            request: {
                method: method,
                url: url,
                config: config !== null && config !== void 0 ? config : null,
                data: data !== null && data !== void 0 ? data : null,
            },
            response: e.response
                ? {
                    status: e.response.status,
                    data: e.response.data,
                }
                : null,
            error: {
                status: e.status,
                message: e.message,
            },
        };
        logger.error(message, debug);
        return false;
    }
}
exports.Api = Api;
