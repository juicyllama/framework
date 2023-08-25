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
const account_service_1 = require("../../modules/accounts/account.service");
const account_module_1 = require("../../modules/accounts/account.module");
const E = account_entity_1.Account;
const MODULE = account_module_1.AccountModule;
const SERVICE = account_service_1.AccountService;
describe('TypeORM query findAll filtering RHS Colon syntax', () => {
    const scaffolding = new test_1.Scaffold();
    let scaffold;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
        scaffold.values.mock = {
            account_name: 'TestFiltering',
            onboarding_step: 3,
        };
    }));
    it('Create a record for testing', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield scaffold.query.create(scaffold.repository, scaffold.values.mock);
        expect(result).toBeDefined();
        expect(result.account_id).toBeDefined();
        scaffold.values.record = result;
    }));
    const testData = [
        {
            name: 'EQ',
            query: { account_name: 'EQ:TestFiltering' },
            expected: 1,
        },
        {
            name: 'EQ with no matches',
            query: { account_name: 'EQ:WrongName' },
            expected: 0,
        },
        {
            name: '!EQ',
            query: { account_name: '!EQ:TestFiltering' },
            expected: 1,
        },
        {
            name: '!EQ with no matches',
            query: { account_name: '!EQ:WrongName' },
            expected: 2,
        },
        {
            name: 'GT',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GT:2' },
            expected: 1,
        },
        {
            name: 'GT with exact match',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GT:3' },
            expected: 0,
        },
        {
            name: 'GT with no matches',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GT:4' },
            expected: 0,
        },
        {
            name: 'GTE',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GTE:2' },
            expected: 1,
        },
        {
            name: 'GTE with exact match',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GTE:3' },
            expected: 1,
        },
        {
            name: 'GTE with no matches',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GTE:4' },
            expected: 0,
        },
        {
            name: 'LT',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LT:4' },
            expected: 1,
        },
        {
            name: 'LT with exact matches',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LT:3' },
            expected: 0,
        },
        {
            name: 'LT with no matches',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LT:2' },
            expected: 0,
        },
        {
            name: 'LTE',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LTE:4' },
            expected: 1,
        },
        {
            name: 'LTE with exact matches',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LTE:3' },
            expected: 1,
        },
        {
            name: 'LTE with no matches',
            query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LTE:2' },
            expected: 0,
        },
        {
            name: 'Overloading operators: GT and LT',
            query: {
                account_name: 'EQ:TestFiltering',
                onboarding_step: ['GT:2', 'LT:4'],
            },
            expected: 1,
        },
        {
            name: 'Overloading operators: GT and LT with no matches',
            query: {
                account_name: 'EQ:TestFiltering',
                onboarding_step: ['GT:2', 'LT:3'],
            },
            expected: 0,
        },
        {
            name: 'Overloading operators: GT and LT with no matches #2',
            query: {
                account_name: 'EQ:TestFiltering',
                onboarding_step: ['GT:3', 'LT:4'],
            },
            expected: 0,
        },
        {
            name: 'Overloading operators: GT, GTE and LT',
            query: {
                account_name: 'EQ:TestFiltering',
                onboarding_step: ['GT:2', 'GTE:3', 'LT:5'],
            },
            expected: 1,
        },
        {
            name: 'Overloading operators: GT, GTE and LT with no matches',
            query: {
                account_name: 'EQ:TestFiltering',
                onboarding_step: ['GT:1', 'GTE:2', 'LT:3'],
            },
            expected: 0,
        },
        {
            name: 'Overloading operators: GT, GTE and LT with no matches #2',
            query: {
                account_name: 'EQ:TestFiltering',
                onboarding_step: ['GT:1', 'GTE:4', 'LT:4'],
            },
            expected: 0,
        },
        {
            name: 'NULL',
            query: { avatar_image_url: 'NULL' },
            expected: 2,
        },
        {
            name: 'NULL with no matches',
            query: { account_name: 'NULL' },
            expected: 0,
        },
        {
            name: '!NULL',
            query: { account_name: '!NULL' },
            expected: 2,
        },
        {
            name: '!NULL with no matches',
            query: { avatar_image_url: '!NULL' },
            expected: 0,
        },
        {
            name: 'EQ backward-compatibility',
            query: { account_name: 'TestFiltering' },
            expected: 1,
        },
        {
            name: 'EQ backward-compatibility, no matches',
            query: { account_name: 'wrongName' },
            expected: 0,
        },
    ];
    testData.forEach(({ name, query, expected }) => {
        it(name, () => __awaiter(void 0, void 0, void 0, function* () {
            const where = scaffold.query.buildWhere({
                repository: scaffold.repository,
                query,
            });
            const result = yield scaffold.query.findAll(scaffold.repository, { where: where });
            expect(result).toBeDefined();
            expect(result.length).toEqual(expected);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
//# sourceMappingURL=Query.filtering.test.spec.js.map