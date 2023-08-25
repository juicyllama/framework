"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.TestService = exports.TestEndpoint = void 0;
const supertest_1 = __importDefault(require("supertest"));
const utils_1 = require("@juicyllama/utils");
const types_1 = require("../types");
const querystring = __importStar(require("querystring"));
function TestEndpoint(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let E;
        const headers = {
            Authorization: 'Bearer ' + ((_a = options.access_token) !== null && _a !== void 0 ? _a : options.scaffold.values.owner_access_token),
            'account-id': options.account
                ? options.account.account_id.toString()
                : options.scaffold.values.account.account_id.toString(),
        };
        switch (options.type) {
            case types_1.METHOD.CREATE:
            case types_1.METHOD.POST:
                const requestBuilder = (0, supertest_1.default)(options.scaffold.server)
                    .post(options.url)
                    .set(headers)
                    .send(options.data);
                if (options.attach) {
                    requestBuilder.attach(options.attach.field, options.attach.file);
                }
                yield requestBuilder
                    .then(({ body }) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (options.PRIMARY_KEY) {
                            expect(body[options.PRIMARY_KEY]).toBeDefined();
                        }
                        options.skipResultCheck || checkResult(options.data, body, options.emitCheckResultKeys);
                        E = body;
                    }
                    catch (e) {
                        E = body;
                        outputError(Object.assign({ error: e, response: body }, options));
                    }
                }))
                    .catch((e) => __awaiter(this, void 0, void 0, function* () {
                    outputError(Object.assign({ error: e }, options));
                }));
                return E;
            case types_1.METHOD.UPDATE:
            case types_1.METHOD.PATCH:
                yield (0, supertest_1.default)(options.scaffold.server)
                    .patch(options.url)
                    .set(headers)
                    .send(options.data)
                    .then(({ body }) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (options.PRIMARY_KEY) {
                            expect(body[options.PRIMARY_KEY]).toBeDefined();
                        }
                        checkResult(options.data, body, options.emitCheckResultKeys);
                        E = body;
                    }
                    catch (e) {
                        outputError(Object.assign({ error: e, response: body }, options));
                    }
                }))
                    .catch((e) => __awaiter(this, void 0, void 0, function* () {
                    outputError(Object.assign({ error: e }, options));
                }));
                return E;
            case types_1.METHOD.PUT:
                yield (0, supertest_1.default)(options.scaffold.server)
                    .put(options.url)
                    .set(headers)
                    .send(options.data)
                    .then(({ body }) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (options.PRIMARY_KEY) {
                            expect(body[options.PRIMARY_KEY]).toBeDefined();
                        }
                        checkResult(options.data, body, options.emitCheckResultKeys);
                        E = body;
                    }
                    catch (e) {
                        outputError(Object.assign({ error: e, response: body }, options));
                    }
                }))
                    .catch((e) => __awaiter(this, void 0, void 0, function* () {
                    outputError(Object.assign({ error: e }, options));
                }));
                return E;
            case types_1.METHOD.GET:
                yield (0, supertest_1.default)(options.scaffold.server)
                    .get(options.url)
                    .set(headers)
                    .then(({ body }) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (options.PRIMARY_KEY) {
                            expect(body[options.PRIMARY_KEY]).toBeDefined();
                        }
                        E = body;
                    }
                    catch (e) {
                        outputError(Object.assign({ error: e, response: body }, options));
                    }
                }))
                    .catch((e) => __awaiter(this, void 0, void 0, function* () {
                    outputError(Object.assign({ error: e }, options));
                }));
                return E;
            case types_1.METHOD.LIST:
                let urlWithQueryString;
                if (options.queryParams) {
                    urlWithQueryString = `${options.url}?${Object.keys(options.queryParams)
                        .map(key => `${key}=${options.queryParams[key]}`)
                        .join('&')}`;
                }
                yield (0, supertest_1.default)(options.scaffold.server)
                    .get(urlWithQueryString !== null && urlWithQueryString !== void 0 ? urlWithQueryString : options.url)
                    .set(headers)
                    .then(({ body }) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (options.PRIMARY_KEY) {
                            expect(body[0][options.PRIMARY_KEY]).toBeTruthy();
                        }
                        E = body;
                    }
                    catch (e) {
                        outputError(Object.assign({ error: e, response: body }, options));
                    }
                }))
                    .catch((e) => __awaiter(this, void 0, void 0, function* () {
                    outputError(Object.assign({ error: e }, options));
                }));
                return E;
            case types_1.METHOD.COUNT:
                yield (0, supertest_1.default)(options.scaffold.server)
                    .get(`${options.url}/stats?method=${utils_1.StatsMethods.COUNT}`)
                    .set(headers)
                    .then(({ body }) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        expect(body.count).toBeGreaterThan(0);
                        E = body;
                    }
                    catch (e) {
                        outputError(Object.assign({ error: e, response: body }, options));
                    }
                }))
                    .catch((e) => __awaiter(this, void 0, void 0, function* () {
                    outputError(Object.assign({ error: e }, options));
                }));
                return E;
            case types_1.METHOD.CHARTS:
                const chartsUrl = `${options.url}/charts?${querystring.stringify(options.queryParams)}`;
                yield (0, supertest_1.default)(options.scaffold.server)
                    .get(chartsUrl)
                    .set(headers)
                    .then(({ body }) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        expect(body.datasets.length).toBeGreaterThan(0);
                        E = body;
                    }
                    catch (e) {
                        outputError(Object.assign({ error: e, response: body }, options));
                    }
                }))
                    .catch((e) => __awaiter(this, void 0, void 0, function* () {
                    outputError(Object.assign({ error: e }, options));
                }));
                return E;
            case types_1.METHOD.DELETE:
                yield (0, supertest_1.default)(options.scaffold.server)
                    .delete(options.url)
                    .set(headers)
                    .then(({ body }) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (options.PRIMARY_KEY) {
                            expect(body[options.PRIMARY_KEY]).toBeDefined();
                        }
                        E = body;
                    }
                    catch (e) {
                        outputError(Object.assign({ error: e, response: body }, options));
                    }
                }))
                    .catch((e) => __awaiter(this, void 0, void 0, function* () {
                    outputError(Object.assign({ error: e }, options));
                }));
                return E;
        }
    });
}
exports.TestEndpoint = TestEndpoint;
function TestService(options) {
    return __awaiter(this, void 0, void 0, function* () {
        let E;
        switch (options.type) {
            case types_1.METHOD.CREATE:
                try {
                    E = yield options.scaffold.services.service.create(options.mock);
                    expect(E[options.PRIMARY_KEY]).toBeDefined();
                    checkResult(options.mock, E);
                    return E;
                }
                catch (e) {
                    outputError(Object.assign({ error: e }, options));
                }
                break;
            case types_1.METHOD.LIST:
                try {
                    E = yield options.scaffold.services.service.findAll();
                    expect(E[0][options.PRIMARY_KEY]).toBeDefined();
                    checkResult(options.mock, E[0]);
                    return E;
                }
                catch (e) {
                    outputError(Object.assign({ error: e }, options));
                }
                break;
            case types_1.METHOD.GET:
                try {
                    E = yield options.scaffold.services.service.findOne();
                    expect(E[options.PRIMARY_KEY]).toBeDefined();
                    checkResult(options.mock, E);
                    return E;
                }
                catch (e) {
                    outputError(Object.assign({ error: e }, options));
                }
                break;
            case types_1.METHOD.COUNT:
                try {
                    E = yield options.scaffold.services.service.count();
                    expect(E).toBeDefined();
                    expect(E).toBeGreaterThan(0);
                    return E;
                }
                catch (e) {
                    outputError(Object.assign({ error: e }, options));
                }
                break;
            case types_1.METHOD.PATCH:
            case types_1.METHOD.UPDATE:
                try {
                    E = yield options.scaffold.services.service.update(Object.assign({ [options.PRIMARY_KEY]: options.record[options.PRIMARY_KEY] }, options.mock));
                    expect(E[options.PRIMARY_KEY]).toBeDefined();
                    checkResult(options.mock, E);
                    return E;
                }
                catch (e) {
                    outputError(Object.assign({ error: e }, options));
                }
                break;
            case types_1.METHOD.DELETE:
                try {
                    yield options.scaffold.services.service.remove(options.record);
                }
                catch (e) {
                    outputError(Object.assign({ error: e }, options));
                }
        }
    });
}
exports.TestService = TestService;
function outputError(options) {
    const logger = new utils_1.Logger();
    const domain = `[TEST][${options.type}][${options.url}]`;
    logger.error(`${domain}`, {
        response: options.response,
        request: {
            type: options.type,
            url: options.url,
            data: options.data,
            params: options.params,
            record: options.record,
            PRIMARY_KEY: options.PRIMARY_KEY,
            primaryKey: options.primaryKey,
            access_token: options.access_token,
            account: options.account,
        },
        error: options.error,
    });
    expect(options.error).toMatch('error');
}
function checkResult(data, result, emitCheckResultKeys) {
    for (const [key] of Object.entries(data)) {
        if (emitCheckResultKeys && emitCheckResultKeys.includes(key))
            continue;
        try {
            switch (typeof data[key]) {
                case 'object':
                    continue;
                case 'number':
                    expect(Number(result[key]).toFixed(2)).toBe(Number(data[key]).toFixed(2));
                    break;
                default:
                    expect(result[key]).toBe(data[key]);
            }
        }
        catch (e) {
            throw new Error(`checkResult failed - ${key} issue, expected: ${data[key]} found: ${result[key]}  `);
        }
    }
}
//# sourceMappingURL=helpers.js.map