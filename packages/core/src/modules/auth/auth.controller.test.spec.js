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
const supertest_1 = __importDefault(require("supertest"));
const role_entity_1 = require("./role.entity");
const faker_1 = require("@faker-js/faker");
const auth_module_1 = require("./auth.module");
const auth_service_1 = require("./auth.service");
const test_1 = require("../../test");
const users_constants_1 = require("../users/users.constants");
const types_1 = require("../../types");
const E = role_entity_1.Role;
const MODULE = auth_module_1.AuthModule;
const SERVICE = auth_service_1.AuthService;
const url = '/auth';
const new_password = faker_1.faker.internet.password(20, false, /[!-~]/);
describe('Auth Endpoints', () => {
    const scaffolding = new test_1.Scaffold();
    let scaffold;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
    }));
    describe('Login', () => {
        it('Create a new record', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(scaffold.server)
                .post(`${url}/login`)
                .send({
                email: scaffold.values.owner.email,
                password: scaffold.values.owner_password,
            })
                .then(({ body }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    expect(body.access_token).toBeDefined();
                    scaffold.values.owner_access_token = body.access_token;
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
    describe('Profile', () => {
        it('Get Profile', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.TestService)({
                type: types_1.METHOD.GET,
                scaffold: scaffold,
                mock: {
                    user_id: scaffold.values.owner.user_id,
                },
                PRIMARY_KEY: users_constants_1.PRIMARY_KEY,
            });
        }));
        it('Account Check', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(scaffold.server)
                .get(`${url}/account/check`)
                .set({
                Authorization: 'Bearer ' + scaffold.values.owner_access_token,
                'account-id': scaffold.values.account.account_id.toString(),
            })
                .then(({ body }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    expect(body.passed).toBeTruthy();
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
    describe('Password Reset', () => {
        it('Password Reset - Start', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(scaffold.server)
                .post(`${url}/password-reset`)
                .send({
                email: scaffold.values.owner.email,
            })
                .then(({ body }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    expect(body.success).toBeTruthy();
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
        it('Password Reset - Code', () => __awaiter(void 0, void 0, void 0, function* () {
            const code = yield scaffold.services.authService.getValidationCode(scaffold.values.owner);
            yield (0, supertest_1.default)(scaffold.server)
                .post(`${url}/password-reset/code`)
                .send({
                email: scaffold.values.owner.email,
                code: code,
            })
                .then(({ body }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    expect(body.success).toBeTruthy();
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
        it('Password Reset - Complete', () => __awaiter(void 0, void 0, void 0, function* () {
            const code = yield scaffold.services.authService.getValidationCode(scaffold.values.owner);
            yield (0, supertest_1.default)(scaffold.server)
                .post(`${url}/password-reset/complete`)
                .send({
                email: scaffold.values.owner.email,
                code: code,
                newPassword: new_password,
            })
                .then(({ body }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    expect(body.access_token).toBeTruthy();
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
    describe('Passwordless', () => {
        it('Passwordless - Start', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(scaffold.server)
                .post(`${url}/passwordless`)
                .send({
                email: scaffold.values.owner.email,
            })
                .then(({ body }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    expect(body.success).toBeTruthy();
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
        it('Passwordless - Code', () => __awaiter(void 0, void 0, void 0, function* () {
            const code = yield scaffold.services.authService.getValidationCode(scaffold.values.owner);
            yield (0, supertest_1.default)(scaffold.server)
                .post(`${url}/passwordless/code`)
                .send({
                email: scaffold.values.owner.email,
                code: code,
            })
                .then(({ body }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    expect(body.access_token).toBeTruthy();
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
//# sourceMappingURL=auth.controller.test.spec.js.map