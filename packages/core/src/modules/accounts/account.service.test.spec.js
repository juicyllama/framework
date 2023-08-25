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
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const account_service_1 = require("./account.service");
const test_1 = require("../../test");
const account_entity_1 = require("./account.entity");
const account_module_1 = require("./account.module");
const Query_1 = require("../../utils/typeorm/Query");
const users_service_1 = require("../users/users.service");
const users_enums_1 = require("../users/users.enums");
const test_2 = require("../../test");
const E = account_entity_1.Account;
const MODULE = account_module_1.AccountModule;
const SERVICE = account_service_1.AccountService;
let PRIMARY_KEY;
describe('Account Service', () => {
    const scaffolding = new test_2.Scaffold();
    let scaffold;
    let record;
    let owner;
    let query;
    let usersService;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
        query = scaffold.module.get(Query_1.Query);
        usersService = scaffold.module.get(users_service_1.UsersService);
        PRIMARY_KEY = query.getPrimaryKey(scaffold.services.service.repository);
    }));
    describe('Onboard', () => {
        it('Onboard a new account and owner', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.services.service.onboard((0, test_1.MockAccountRequest)());
            expect(result).toBeDefined();
            expect(result.account).toBeDefined();
            expect(result.account[PRIMARY_KEY]).toBeDefined();
            expect(result.owner).toBeDefined();
            expect(result.owner.email).toBeDefined();
            record = result.account;
            owner = result.owner;
        }));
    });
    describe('GetOwner', () => {
        it('Return the owner of the account', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.services.service.getOwner(record);
            expect(result).toBeDefined();
            expect(result.email).toBeDefined();
        }));
    });
    describe('Transfer', () => {
        it('Should transfer account to another', () => __awaiter(void 0, void 0, void 0, function* () {
            const mock = {
                email: faker_1.faker.internet.email(),
                password: faker_1.faker.internet.password(),
            };
            let newOwner = yield usersService.create(mock);
            newOwner = yield scaffold.services.authService.assignRole(newOwner, record, users_enums_1.UserRole.ADMIN);
            yield scaffold.services.service.transfer(record, owner, newOwner);
            const result = yield scaffold.services.service.getOwner(record);
            expect(result.email).toBe(mock.email);
        }));
    });
    describe('Onboard Additional Account', () => {
        let new_account;
        it('We have 2 accounts to start', () => __awaiter(void 0, void 0, void 0, function* () {
            const init_count = yield scaffold.services.service.count();
            expect(init_count).toBe(2);
        }));
        it('Create an additional account', () => __awaiter(void 0, void 0, void 0, function* () {
            new_account = yield scaffold.services.service.onboardAdditional(owner, {
                account_name: faker_1.faker.random.word(),
            });
            expect(new_account).toBeDefined();
            expect(new_account.account).toBeDefined();
            expect(new_account.account[PRIMARY_KEY]).toBeDefined();
            expect(new_account.owner).toBeDefined();
            expect(new_account.owner.email).toEqual(owner.email);
        }));
        it('We now have 3 accounts', () => __awaiter(void 0, void 0, void 0, function* () {
            const init_count = yield scaffold.services.service.count();
            expect(init_count).toBe(3);
        }));
        it('Should delete additional account', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield scaffold.services.service.remove(new_account.account);
            }
            catch (e) {
                expect(e).toBeUndefined();
            }
        }));
    });
    describe('Delete', () => {
        it('Should delete existing record', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield scaffold.services.service.remove(record);
            }
            catch (e) {
                expect(e).toBeUndefined();
            }
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
//# sourceMappingURL=account.service.test.spec.js.map