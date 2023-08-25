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
const account_entity_1 = require("./account.entity");
const test_1 = require("../../test");
const faker_1 = require("@faker-js/faker");
const account_module_1 = require("./account.module");
const supertest_1 = __importDefault(require("supertest"));
const test_2 = require("../../test");
const account_service_1 = require("./account.service");
const types_1 = require("../../types");
const E = account_entity_1.Account;
const MODULE = account_module_1.AccountModule;
const SERVICE = account_service_1.AccountService;
const url = '/account';
const NAME = 'Account';
const PRIMARY_KEY = 'account_id';
const password = faker_1.faker.internet.password(20, false, /[!-~]/);
describe(`${NAME} Endpoints`, () => {
    const scaffolding = new test_2.Scaffold();
    let scaffold;
    let account;
    let owner;
    let primaryKey;
    let owner_access_token;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
    }));
    describe('Create', () => {
        it(`Create a new ${NAME}`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(scaffold.server)
                .post(url)
                .send((0, test_1.MockAccountRequest)(password))
                .then(({ body }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    expect(body.account).toBeDefined();
                    expect(body.account.account_id).toBeDefined();
                    expect(body.owner).toBeDefined();
                    expect(body.owner.email).toBeDefined();
                    account = body.account;
                    primaryKey = body.account.account_id;
                    owner = body.owner;
                }
                catch (e) {
                    console.error(body);
                    expect(e).toMatch('error');
                }
            }))
                .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
                console.error(e);
                expect(e).toMatch('error');
            }));
            yield (0, supertest_1.default)(scaffold.server)
                .post('/auth/login')
                .send({
                email: owner.email,
                password: password,
            })
                .then(({ body }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    expect(body.access_token).toBeDefined();
                    owner_access_token = body.access_token;
                }
                catch (e) {
                    console.error(body);
                    expect(e).toMatch('error');
                }
            }))
                .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
                expect(e).toMatch('error');
            }));
        }));
    });
    describe('Get, List, Stats & Search', () => {
        it(`Get ${NAME}`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_2.TestEndpoint)({
                type: types_1.METHOD.GET,
                scaffold: scaffold,
                url: `${url}/${primaryKey}`,
                PRIMARY_KEY: PRIMARY_KEY,
                primaryKey: primaryKey,
                access_token: owner_access_token,
                account: account,
            });
        }));
        it(`List ${NAME}`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_2.TestEndpoint)({
                type: types_1.METHOD.LIST,
                scaffold: scaffold,
                url: url,
                PRIMARY_KEY: PRIMARY_KEY,
                access_token: owner_access_token,
                account: account,
            });
        }));
        it(`Count ${NAME}`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_2.TestEndpoint)({
                type: types_1.METHOD.COUNT,
                scaffold: scaffold,
                url: url,
                access_token: owner_access_token,
                account: account,
            });
        }));
        it('Search by account name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_2.TestEndpoint)({
                type: types_1.METHOD.LIST,
                scaffold: scaffold,
                url: url,
                PRIMARY_KEY: PRIMARY_KEY,
                queryParams: {
                    search: account.account_name,
                },
                access_token: owner_access_token,
                account: account,
            });
        }));
    });
    describe('Update', () => {
        const patch = {
            account_name: faker_1.faker.random.word(),
        };
        it(`Update ${NAME} `, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_2.TestEndpoint)({
                type: types_1.METHOD.UPDATE,
                scaffold: scaffold,
                url: `${url}/${primaryKey}`,
                PRIMARY_KEY: PRIMARY_KEY,
                data: patch,
                access_token: owner_access_token,
                account: account,
            });
        }));
    });
    describe('Remove', () => {
        it(`Remove ${NAME}`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_2.TestEndpoint)({
                type: types_1.METHOD.DELETE,
                scaffold: scaffold,
                url: url,
                PRIMARY_KEY: PRIMARY_KEY,
                access_token: owner_access_token,
                account: account,
            });
        }));
    });
    describe('Create Additional', () => {
        it(`Create an additional ${NAME}`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(scaffold.server)
                .post(url + '/additional')
                .set({
                Authorization: 'Bearer ' + owner_access_token,
                'account-id': account.account_id.toString(),
            })
                .send({ account_name: faker_1.faker.random.word() })
                .then(({ body }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    expect(body.account).toBeDefined();
                    expect(body.account.account_id).toBeDefined();
                    expect(body.owner).toBeDefined();
                    expect(body.owner.email).toEqual(owner.email);
                }
                catch (e) {
                    console.error(body);
                    expect(e).toMatch('error');
                }
            }))
                .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
                console.error(e);
                expect(e).toMatch('error');
            }));
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
//# sourceMappingURL=account.controller.test.spec.js.map