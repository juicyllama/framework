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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const users_module_1 = require("./users.module");
const test_1 = require("../../test");
const users_entity_1 = require("./users.entity");
const types_1 = require("../../types");
const users_service_1 = require("./users.service");
const users_enums_1 = require("./users.enums");
const faker_1 = require("@faker-js/faker");
const E = users_entity_1.User;
const MODULE = users_module_1.UsersModule;
const SERVICE = users_service_1.UsersService;
const url = '/users';
const NAME = 'User';
const PRIMARY_KEY = 'user_id';
describe(`${NAME} Endpoints`, () => {
    const scaffolding = new test_1.Scaffold();
    let scaffold;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
        scaffold.values.mock = (0, test_1.MockUserRequest)(scaffold.values.account);
    }));
    describe('Create', () => {
        it(`Create a new ${NAME}`, () => __awaiter(void 0, void 0, void 0, function* () {
            scaffold.values.record = yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.CREATE,
                scaffold: scaffold,
                url: url,
                PRIMARY_KEY: PRIMARY_KEY,
                data: scaffold.values.mock,
                emitCheckResultKeys: ['password'],
            });
        }));
    });
    describe('Get, List, Stats & Search', () => {
        it(`Get ${NAME}`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.GET,
                scaffold: scaffold,
                url: `${url}/${scaffold.values.record[PRIMARY_KEY]}`,
                PRIMARY_KEY: PRIMARY_KEY,
                primaryKey: scaffold.values.record[PRIMARY_KEY],
            });
        }));
        it(`List ${NAME}`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.LIST,
                scaffold: scaffold,
                url: url,
                PRIMARY_KEY: PRIMARY_KEY,
            });
        }));
        it(`Count ${NAME}`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.COUNT,
                scaffold: scaffold,
                url: url,
            });
        }));
        it('Search by first name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.LIST,
                scaffold: scaffold,
                url: url,
                PRIMARY_KEY: PRIMARY_KEY,
                queryParams: {
                    search: scaffold.values.mock.first_name,
                },
            });
        }));
    });
    describe('Update', () => {
        it(`Update ${NAME} `, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.UPDATE,
                scaffold: scaffold,
                url: `${url}/${scaffold.values.record[PRIMARY_KEY]}`,
                PRIMARY_KEY: PRIMARY_KEY,
                data: {
                    first_name: faker_1.faker.name.firstName(),
                },
            });
        }));
        it(`Update ${NAME} Role`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.UPDATE,
                scaffold: scaffold,
                url: `${url}/${scaffold.values.record[PRIMARY_KEY]}/role`,
                PRIMARY_KEY: PRIMARY_KEY,
                data: {
                    role: users_enums_1.UserRole.ADMIN,
                },
                emitCheckResultKeys: ['role'],
            });
            const role = yield scaffold.services.authService.getRole(scaffold.values.record[PRIMARY_KEY], scaffold.values.account.account_id);
            expect(role.role).toEqual(users_enums_1.UserRole.ADMIN);
        }));
    });
    describe('Upload CSV', () => {
        it(`Inserts one record `, () => __awaiter(void 0, void 0, void 0, function* () {
            const { filePath, unlink } = yield createTempFileFromString(`first_name,last_name,email
John,Snow,john@got.com`);
            const res = yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.POST,
                scaffold: scaffold,
                url: `${url}/upload_csv`,
                attach: {
                    field: 'file',
                    file: filePath,
                },
                skipResultCheck: true,
            });
            yield unlink();
            expect(res['affectedRows']).toEqual(1);
            const users = yield scaffold.services.service.findAll({});
            const lastUser = users.pop();
            expect(lastUser.first_name).toEqual('John');
            expect(lastUser.last_name).toEqual('Snow');
            expect(lastUser.email).toEqual('john@got.com');
        }));
        it(`Inserts two records`, () => __awaiter(void 0, void 0, void 0, function* () {
            const { filePath, unlink } = yield createTempFileFromString(`first_name,last_name,email
Amy,Smith,amy@smith.com				
John1,Snow1,john@got1.com`);
            const res = yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.POST,
                scaffold: scaffold,
                url: `${url}/upload_csv`,
                attach: {
                    field: 'file',
                    file: filePath,
                },
                skipResultCheck: true,
            });
            yield unlink();
            console.log('resres', res);
            expect(res['affectedRows']).toEqual(2);
        }));
        it(`Inserts 0 records if duplicate is found`, () => __awaiter(void 0, void 0, void 0, function* () {
            const { filePath, unlink } = yield createTempFileFromString(`first_name,last_name,email
Amy,Smith,amy@smith.com				
John1,Snow1,john@got1.com`);
            const usersCount = yield scaffold.services.service.count({});
            const res = yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.POST,
                scaffold: scaffold,
                url: `${url}/upload_csv`,
                attach: {
                    field: 'file',
                    file: filePath,
                },
                skipResultCheck: true,
            });
            yield unlink();
            const newUsersCount = yield scaffold.services.service.count({});
            expect(res['statusCode']).toEqual(400);
            expect(res['message']).toMatch("Duplicate entry 'amy@smith.com");
            expect(newUsersCount).toEqual(usersCount);
        }));
    });
    describe('Remove', () => {
        it(`Remove ${NAME}`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.DELETE,
                scaffold: scaffold,
                url: `${url}/${scaffold.values.record[PRIMARY_KEY]}`,
                PRIMARY_KEY: PRIMARY_KEY,
            });
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
function createTempFileFromString(content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tempDir = fs.mkdtempSync(path.join(fs.realpathSync('.'), 'temp-'));
            const tempFilePath = path.join(tempDir, 'temp-file.csv');
            yield fs.promises.writeFile(tempFilePath, content, 'utf-8');
            return { filePath: tempFilePath, unlink: () => fs.promises.unlink(tempFilePath) };
        }
        catch (error) {
            throw new Error(`Error creating temporary file: ${error}`);
        }
    });
}
//# sourceMappingURL=users.controller.test.spec.js.map