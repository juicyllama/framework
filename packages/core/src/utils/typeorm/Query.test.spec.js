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
const account_entity_1 = require("../../modules/accounts/account.entity");
const test_1 = require("../../test");
const faker_1 = require("@faker-js/faker");
const account_service_1 = require("../../modules/accounts/account.service");
const account_module_1 = require("../../modules/accounts/account.module");
const E = account_entity_1.Account;
const MODULE = account_module_1.AccountModule;
const SERVICE = account_service_1.AccountService;
describe('TypeORM query', () => {
    const scaffolding = new test_1.Scaffold();
    let scaffold;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
        scaffold.values.mock = {
            account_name: faker_1.faker.random.words(),
        };
    }));
    describe('Raw', () => {
        it('Perform a raw query', () => __awaiter(void 0, void 0, void 0, function* () {
            const SQL = `SELECT * FROM accounts`;
            const result = yield scaffold.query.raw(scaffold.repository, SQL);
            expect(result).toBeDefined();
            expect(result[0]).toBeDefined();
            expect(result[0].account_id).toBeDefined();
        }));
    });
    describe('Create', () => {
        it('Perform a create query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.create(scaffold.repository, scaffold.values.mock);
            expect(result).toBeDefined();
            expect(result.account_id).toBeDefined();
            scaffold.values.record = result;
        }));
    });
    describe('FindOneById', () => {
        it('Perform a findOneById query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findOneById(scaffold.repository, scaffold.values.account.account_id);
            expect(result).toBeDefined();
            expect(result.account_id).toBeDefined();
            expect(result.account_id).toEqual(scaffold.values.account.account_id);
        }));
        it('Perform a findOneById scaffold.query with relations', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findOneById(scaffold.repository, scaffold.values.account.account_id, [
                'roles',
            ]);
            expect(result).toBeDefined();
            expect(result.account_id).toBeDefined();
            expect(result.account_id).toEqual(scaffold.values.account.account_id);
            expect(result.roles).toBeDefined();
            expect(result.roles[0]).toBeDefined();
        }));
    });
    describe('FindOneByWhere', () => {
        it('Perform a findOneByWhere query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findOneByWhere(scaffold.repository, {
                account_id: scaffold.values.account.account_id,
            });
            expect(result).toBeDefined();
            expect(result.account_id).toBeDefined();
            expect(result.account_id).toEqual(scaffold.values.account.account_id);
        }));
        it('Perform a findOneByWhere scaffold.query with relations', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findOneByWhere(scaffold.repository, { account_id: scaffold.values.account.account_id }, { relations: ['roles'] });
            expect(result).toBeDefined();
            expect(result.account_id).toBeDefined();
            expect(result.account_id).toEqual(scaffold.values.account.account_id);
            expect(result.roles).toBeDefined();
            expect(result.roles[0]).toBeDefined();
        }));
    });
    describe('FindOne', () => {
        it('Perform a findOne query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findOne(scaffold.repository);
            expect(result).toBeDefined();
            expect(result.account_id).toBeDefined();
        }));
        it('Perform a findOne scaffold.query with options', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findOne(scaffold.repository, {
                where: { account_id: scaffold.values.account.account_id },
            });
            expect(result).toBeDefined();
            expect(result.account_id).toBeDefined();
            expect(result.account_id).toEqual(scaffold.values.account.account_id);
        }));
        it('Perform a findOne scaffold.query with options & relations', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findOne(scaffold.repository, {
                where: { account_id: scaffold.values.account.account_id },
                relations: ['roles'],
            });
            expect(result).toBeDefined();
            expect(result.account_id).toBeDefined();
            expect(result.account_id).toEqual(scaffold.values.account.account_id);
            expect(result.roles).toBeDefined();
            expect(result.roles[0]).toBeDefined();
        }));
    });
    describe('FindAll', () => {
        it('Perform a findAll query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findAll(scaffold.repository);
            expect(result).toBeDefined();
            expect(result[0]).toBeDefined();
            expect(result[0].account_id).toBeDefined();
        }));
        it('Perform a findAll scaffold.query with options', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findAll(scaffold.repository, {
                where: { account_id: scaffold.values.account.account_id },
            });
            expect(result).toBeDefined();
            expect(result[0]).toBeDefined();
            expect(result[0].account_id).toBeDefined();
            expect(result[0].account_id).toEqual(scaffold.values.account.account_id);
        }));
        it('Perform a findAll scaffold.query with relations', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findAll(scaffold.repository, { relations: ['roles'] });
            expect(result).toBeDefined();
            expect(result[0]).toBeDefined();
            expect(result[0].account_id).toBeDefined();
        }));
        it('Perform a findAll scaffold.query with options & relations', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findAll(scaffold.repository, {
                where: { account_id: scaffold.values.account.account_id },
                relations: ['roles'],
            });
            expect(result).toBeDefined();
            expect(result[0]).toBeDefined();
            expect(result[0].account_id).toBeDefined();
            expect(result[0].roles).toBeDefined();
            expect(result[0].roles[0]).toBeDefined();
        }));
        it('Filter out invalid select items', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.findAll(scaffold.repository, {
                select: ['account_id', 'account_name', 'invalid_select_item'],
                where: { account_id: scaffold.values.account.account_id },
            });
            expect(result).toBeDefined();
            expect(result[0]).toBeDefined();
            expect(result[0].account_id).toBeDefined();
            expect(result[0].account_name).toBeDefined();
        }));
    });
    describe('FindAll BuildWhere', () => {
        it('Perform a find with buildWhere account_id', () => __awaiter(void 0, void 0, void 0, function* () {
            const where = scaffold.query.buildWhere({
                repository: scaffold.repository,
                account_id: scaffold.values.account.account_id,
            });
            const result = yield scaffold.query.findAll(scaffold.repository, { where: where });
            expect(result).toBeDefined();
            expect(result[0]).toBeDefined();
            expect(result[0].account_id).toBeDefined();
        }));
        it('Perform a find with buildWhere account_id and query', () => __awaiter(void 0, void 0, void 0, function* () {
            const where = scaffold.query.buildWhere({
                repository: scaffold.repository,
                account_id: scaffold.values.account.account_id,
                query: {
                    account_name: scaffold.values.account.account_name,
                },
            });
            const result = yield scaffold.query.findAll(scaffold.repository, { where: where });
            expect(result).toBeDefined();
            expect(result[0]).toBeDefined();
            expect(result[0].account_id).toBeDefined();
            expect(result[0].account_name).toEqual(scaffold.values.account.account_name);
        }));
        it('Perform a find with buildWhere account_id and search', () => __awaiter(void 0, void 0, void 0, function* () {
            const where = scaffold.query.buildWhere({
                repository: scaffold.repository,
                account_id: scaffold.values.account.account_id,
                query: {
                    search: scaffold.values.account.account_name,
                },
                search_fields: ['account_name'],
            });
            const result = yield scaffold.query.findAll(scaffold.repository, { where: where });
            expect(result).toBeDefined();
            expect(result[0]).toBeDefined();
            expect(result[0].account_id).toBeDefined();
            expect(result[0].account_name).toEqual(scaffold.values.account.account_name);
        }));
        it('Perform a find with buildWhere account_id and scaffold.query value is false', () => __awaiter(void 0, void 0, void 0, function* () {
            yield scaffold.query.update(scaffold.repository, {
                account_id: scaffold.values.account.account_id,
                onboarding_complete: false,
            });
            const where = scaffold.query.buildWhere({
                repository: scaffold.repository,
                account_id: scaffold.values.account.account_id,
                query: {
                    onboarding_complete: false,
                },
            });
            const result = yield scaffold.query.findAll(scaffold.repository, { where: where });
            expect(result).toBeDefined();
            expect(result[0]).toBeDefined();
            expect(result[0].account_id).toBeDefined();
            expect(result[0].account_name).toEqual(scaffold.values.account.account_name);
            expect(result[0].onboarding_complete).toEqual(false);
        }));
    });
    describe('Update', () => {
        it('Perform a create query', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAccountUpdate = {
                account_id: scaffold.values.account.account_id,
                account_name: faker_1.faker.random.words(),
            };
            const result = yield scaffold.query.update(scaffold.repository, mockAccountUpdate);
            expect(result).toBeDefined();
            expect(result.account_id).toEqual(mockAccountUpdate.account_id),
                expect(result.account_name).toEqual(mockAccountUpdate.account_name);
        }));
    });
    describe('Stats', () => {
        it('Perform a count query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.count(scaffold.repository);
            expect(result).toBeDefined();
            expect(result).toBeGreaterThan(0);
        }));
        it('Perform a count scaffold.query with options', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.count(scaffold.repository, {
                where: { account_id: scaffold.values.account.account_id },
            });
            expect(result).toBeDefined();
        }));
        it('Perform a sum query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.sum(scaffold.repository, 'account_id', {
                where: { account_id: scaffold.values.account.account_id },
            });
            expect(result).toBeDefined();
            expect(result).toEqual(1);
        }));
        it('Perform a avg query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.sum(scaffold.repository, 'account_id', {
                where: { account_id: scaffold.values.account.account_id },
            });
            expect(result).toBeDefined();
            expect(result).toEqual(1);
        }));
    });
    describe('Lookups', () => {
        it('Perform a getPrimaryKey query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = scaffold.query.getPrimaryKey(scaffold.repository);
            expect(result).toEqual('account_id');
        }));
        it('Perform a getTableName query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = scaffold.query.getTableName(scaffold.repository);
            expect(result).toEqual('accounts');
        }));
        it('Perform a getRelations query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = scaffold.query.getRelations(scaffold.repository);
            expect(result).toBeDefined();
            expect(result['roles']).toEqual(true);
        }));
        it('Perform a getEventName query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = scaffold.query.getEventName(scaffold.repository, scaffold.values.account);
            expect(result).toEqual('account_1_accounts');
        }));
    });
    describe('Remove', () => {
        it('Perform a remove query', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.query.remove(scaffold.repository, scaffold.values.record);
            expect(result).toBeDefined();
            expect(result.account_id).toEqual(scaffold.values.record.account_id);
        }));
    });
    describe('Purge', () => {
        it('Perform a purge query', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield scaffold.query.remove(scaffold.repository, scaffold.values.record);
            }
            catch (e) {
                console.error(e);
                expect(e).toEqual('error');
            }
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
//# sourceMappingURL=Query.test.spec.js.map