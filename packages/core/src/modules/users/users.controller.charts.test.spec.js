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
const users_module_1 = require("./users.module");
const test_1 = require("../../test");
const users_entity_1 = require("./users.entity");
const types_1 = require("../../types");
const utils_1 = require("@juicyllama/utils");
const users_service_1 = require("./users.service");
const E = users_entity_1.User;
const MODULE = users_module_1.UsersModule;
const SERVICE = users_service_1.UsersService;
const url = '/users';
const NAME = 'User';
let userService;
describe(`${NAME} Charts Endpoint`, () => {
    const scaffolding = new test_1.Scaffold();
    let scaffold;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
        userService = scaffold.module.get(SERVICE);
    }));
    function testCharts(queryParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, test_1.TestEndpoint)({
                type: types_1.METHOD.CHARTS,
                scaffold: scaffold,
                url: url,
                queryParams: Object.assign({ fields: ['first_name'] }, queryParams),
            });
            return result;
        });
    }
    describe('Pie', () => {
        it('with a single record and single group field', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield testCharts();
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data']).toEqual([
                {
                    count: '1',
                    first_name: 'Owner',
                },
            ]);
        }));
        it('with 3 records and single group field', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { first_name: 'Owner' }));
            const u2 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { first_name: 'Alexa' }));
            const result = yield testCharts();
            yield userService.purge(u1);
            yield userService.purge(u2);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data']).toEqual([
                {
                    count: '2',
                    first_name: 'Owner',
                },
                {
                    count: '1',
                    first_name: 'Alexa',
                },
            ]);
        }));
        it('with 3 records and two group fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { first_name: 'Owner', last_name: 'User' }));
            const u2 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { first_name: 'Alexa', last_name: 'User' }));
            const result = yield testCharts({
                fields: ['first_name', 'last_name'],
            });
            yield userService.purge(u1);
            yield userService.purge(u2);
            expect(result['datasets'].length).toEqual(2);
            expect(result['datasets'][0]['data']).toEqual([
                {
                    count: '2',
                    first_name: 'Owner',
                },
                {
                    count: '1',
                    first_name: 'Alexa',
                },
            ]);
            expect(result['datasets'][1]['data']).toEqual([
                {
                    count: '3',
                    last_name: 'User',
                },
            ]);
        }));
    });
    describe('Line by day', () => {
        it('with a single record and no group field should return division by time_interval only', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:33:00.000Z'), last_name: 'Test' }));
            const result = yield testCharts({
                fields: [],
                period: utils_1.ChartsPeriod.DAY,
                search: 'Test',
            });
            yield userService.purge(u1);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data']).toEqual([
                {
                    count: '1',
                    time_interval: '2023-08-07T00:00:00.000Z',
                },
            ]);
        }));
        it('with a single record and single group field', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:33:00.000Z'), first_name: 'Test', last_name: 'Test' }));
            const result = yield testCharts({
                period: utils_1.ChartsPeriod.DAY,
                search: 'Test',
            });
            yield userService.purge(u1);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data']).toEqual([
                {
                    count: '1',
                    first_name: 'Test',
                    time_interval: '2023-08-07T00:00:00.000Z',
                },
            ]);
        }));
        it('with 3 records and no group field', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { first_name: 'Owner', last_name: 'Test', created_at: new Date('2023-08-07T14:33:00.000Z') }));
            const u2 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-09T14:33:00.000Z'), first_name: 'Alexa', last_name: 'Test' }));
            const u3 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-09T14:33:00.000Z'), first_name: 'Alexa', last_name: 'Test' }));
            const result = yield testCharts({ fields: [], period: utils_1.ChartsPeriod.DAY, search: 'Test' });
            yield userService.purge(u1);
            yield userService.purge(u2);
            yield userService.purge(u3);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data']).toEqual([
                {
                    count: '1',
                    time_interval: '2023-08-07T00:00:00.000Z',
                },
                {
                    count: '2',
                    time_interval: '2023-08-09T00:00:00.000Z',
                },
            ]);
        }));
        it('with 3 records and a single group field', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { first_name: 'Owner', last_name: 'Test', created_at: new Date('2023-08-07T14:33:00.000Z') }));
            const u2 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-09T14:33:00.000Z'), first_name: 'Siri', last_name: 'Test' }));
            const u3 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-09T14:33:00.000Z'), first_name: 'Alexa', last_name: 'Test' }));
            const result = yield testCharts({ period: utils_1.ChartsPeriod.DAY, search: 'Test' });
            yield userService.purge(u1);
            yield userService.purge(u2);
            yield userService.purge(u3);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data']).toEqual([
                {
                    count: '1',
                    first_name: 'Owner',
                    time_interval: '2023-08-07T00:00:00.000Z',
                },
                {
                    count: '1',
                    first_name: 'Siri',
                    time_interval: '2023-08-09T00:00:00.000Z',
                },
                {
                    count: '1',
                    first_name: 'Alexa',
                    time_interval: '2023-08-09T00:00:00.000Z',
                },
            ]);
        }));
        it('with 3 records and two group fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { first_name: 'Owner', last_name: 'Test', created_at: new Date('2023-08-07T14:33:00.000Z') }));
            const u2 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-09T14:33:00.000Z'), first_name: 'Siri', last_name: 'Test' }));
            const u3 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-09T14:33:00.000Z'), first_name: 'Alexa', last_name: 'Test' }));
            const result = yield testCharts({ fields: ['first_name', 'last_name'], period: utils_1.ChartsPeriod.DAY, search: 'Test' });
            yield userService.purge(u1);
            yield userService.purge(u2);
            yield userService.purge(u3);
            expect(result['datasets'].length).toEqual(2);
            expect(result['datasets'][0]['data']).toEqual([
                {
                    count: '1',
                    first_name: 'Owner',
                    time_interval: '2023-08-07T00:00:00.000Z',
                },
                {
                    count: '1',
                    first_name: 'Siri',
                    time_interval: '2023-08-09T00:00:00.000Z',
                },
                {
                    count: '1',
                    first_name: 'Alexa',
                    time_interval: '2023-08-09T00:00:00.000Z',
                },
            ]);
            expect(result['datasets'][1]['data']).toEqual([
                {
                    count: '1',
                    last_name: 'Test',
                    time_interval: '2023-08-07T00:00:00.000Z',
                },
                {
                    count: '2',
                    last_name: 'Test',
                    time_interval: '2023-08-09T00:00:00.000Z',
                },
            ]);
        }));
    });
    describe('Line', () => {
        it('with 4 records by 15 min', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:33:00.000Z'), last_name: 'Test' }));
            const u2 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:44:00.000Z'), last_name: 'Test' }));
            const u3 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:49:00.000Z'), last_name: 'Test' }));
            const u4 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:57:00.000Z'), last_name: 'Test' }));
            const result = yield testCharts({
                fields: [],
                period: utils_1.ChartsPeriod['15MIN'],
                search: 'Test',
            });
            yield userService.purge(u1);
            yield userService.purge(u2);
            yield userService.purge(u3);
            yield userService.purge(u4);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data']).toEqual([
                { count: '2', time_interval: '2023-08-07T14:30:00.000Z' },
                { count: '2', time_interval: '2023-08-07T14:45:00.000Z' },
            ]);
        }));
        it('with 4 records by 30 min', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:33:00.000Z'), last_name: 'Test' }));
            const u2 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:49:00.000Z'), last_name: 'Test' }));
            const u3 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:02:00.000Z'), last_name: 'Test' }));
            const u4 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:27:00.000Z'), last_name: 'Test' }));
            const result = yield testCharts({
                fields: [],
                period: utils_1.ChartsPeriod['30MIN'],
                search: 'Test',
            });
            yield userService.purge(u1);
            yield userService.purge(u2);
            yield userService.purge(u3);
            yield userService.purge(u4);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data']).toEqual([
                { count: '2', time_interval: '2023-08-07T14:30:00.000Z' },
                { count: '2', time_interval: '2023-08-07T14:00:00.000Z' },
            ]);
        }));
        it('with 4 records by hour', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:33:00.000Z'), last_name: 'Test' }));
            const u2 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T14:49:00.000Z'), last_name: 'Test' }));
            const u3 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T15:02:00.000Z'), last_name: 'Test' }));
            const u4 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-08-07T15:27:00.000Z'), last_name: 'Test' }));
            const result = yield testCharts({
                fields: [],
                period: utils_1.ChartsPeriod.HOUR,
                search: 'Test',
            });
            yield userService.purge(u1);
            yield userService.purge(u2);
            yield userService.purge(u3);
            yield userService.purge(u4);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data']).toEqual([
                { count: '2', time_interval: '2023-08-07T14:00:00.000Z' },
                { count: '2', time_interval: '2023-08-07T15:00:00.000Z' },
            ]);
        }));
        it('with 4 records by week', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2020-01-01') }));
            const u2 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2020-01-10') }));
            const u3 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2020-01-10') }));
            const result = yield testCharts({ fields: [], period: utils_1.ChartsPeriod.WEEK });
            yield userService.purge(u1);
            yield userService.purge(u2);
            yield userService.purge(u3);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data'].length).toEqual(3);
        }));
        it('with 3 records by month', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2020-01-01') }));
            const u2 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2020-01-03') }));
            const result = yield testCharts({ fields: [], period: utils_1.ChartsPeriod.MONTH });
            yield userService.purge(u1);
            yield userService.purge(u2);
            expect(result['datasets'].length).toEqual(1);
            const firstDayOfCurrentMonth = new Date();
            firstDayOfCurrentMonth.setDate(1);
            expect(result['datasets'][0]['data']).toEqual([
                {
                    count: '1',
                    time_interval: getChartsIsoDate(firstDayOfCurrentMonth).split('T')[0],
                },
                {
                    count: '2',
                    time_interval: '2020-01-01',
                },
            ]);
        }));
        it('with 3 records by year', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2020-01-01') }));
            const u2 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2020-04-03') }));
            const result = yield testCharts({ fields: [], period: utils_1.ChartsPeriod.YEAR });
            yield userService.purge(u1);
            yield userService.purge(u2);
            expect(result['datasets'].length).toEqual(1);
            const firstDayOfCurrentYear = new Date();
            firstDayOfCurrentYear.setDate(1);
            firstDayOfCurrentYear.setMonth(0);
            expect(result['datasets'][0]['data']).toEqual([
                {
                    count: '1',
                    time_interval: getChartsIsoDate(firstDayOfCurrentYear).split('T')[0],
                },
                {
                    count: '2',
                    time_interval: '2020-01-01',
                },
            ]);
        }));
    });
    describe('Search (with two search fields)', () => {
        it('no results', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield testCharts({
                search: 'notFound',
            });
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data'].length).toEqual(0);
        }));
        it('results by first field', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield testCharts({
                search: 'Owne',
            });
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data'].length).toEqual(1);
        }));
        it('results by second field', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield testCharts({
                search: 'ser',
            });
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data'].length).toEqual(1);
        }));
    });
    describe('Filter by dates', () => {
        it('with no from or to, returns result', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-02-01T00:00:00.000Z'), last_name: 'Test' }));
            const result = yield testCharts({
                search: 'Test',
            });
            yield userService.purge(u1);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data'].length).toEqual(1);
        }));
        it('finds a record younger than "from"', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-02-01T00:00:00.000Z'), last_name: 'Test' }));
            const result = yield testCharts({
                search: 'Test',
                from: '2023-01-01T00:00:00.000Z',
            });
            yield userService.purge(u1);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data'].length).toEqual(1);
        }));
        it('ignores a record older than "from"', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-02-01T00:00:00.000Z'), last_name: 'Test' }));
            const result = yield testCharts({
                search: 'Test',
                from: '2023-04-01T00:00:00.000Z',
            });
            yield userService.purge(u1);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data'].length).toEqual(0);
        }));
        it('finds a record older than "to"', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-02-01T00:00:00.000Z'), last_name: 'Test' }));
            const result = yield testCharts({
                search: 'Test',
                to: '2023-02-04T00:00:00.000Z',
            });
            yield userService.purge(u1);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data'].length).toEqual(1);
        }));
        it('ignores a record younger than "to"', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-02-01T00:00:00.000Z'), last_name: 'Test' }));
            const result = yield testCharts({
                search: 'Test',
                to: '2023-01-01T00:00:00.000Z',
            });
            yield userService.purge(u1);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data'].length).toEqual(0);
        }));
        it('finds a record between "from" and "to"', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2023-02-01T00:00:00.000Z'), last_name: 'Test' }));
            const result = yield testCharts({
                search: 'Test',
                from: '2023-01-01T00:00:00.000Z',
                to: '2023-03-01T00:00:00.000Z',
            });
            yield userService.purge(u1);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data'].length).toEqual(1);
        }));
        it('ignores a record not between "from" and "to"', () => __awaiter(void 0, void 0, void 0, function* () {
            const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), { created_at: new Date('2024-02-01T00:00:00.000Z'), last_name: 'Test' }));
            const result = yield testCharts({
                search: 'Test',
                from: '2023-01-01T00:00:00.000Z',
                to: '2023-03-01T00:00:00.000Z',
            });
            yield userService.purge(u1);
            expect(result['datasets'].length).toEqual(1);
            expect(result['datasets'][0]['data'].length).toEqual(0);
        }));
    });
    describe('Filter using RHS Colon syntax', () => {
        const testData = [
            {
                name: 'EQ',
                create: { last_name: 'TestName' },
                query: { last_name: 'EQ:TestName' },
                expected: 1,
            },
            {
                name: 'EQ with no matches',
                create: { last_name: 'TestName' },
                query: { last_name: 'EQ:WrongName' },
                expected: 0,
            },
            {
                name: '!EQ',
                create: { last_name: 'TestName' },
                query: { last_name: '!EQ:TestName' },
                expected: 1,
            },
            {
                name: '!EQ with no matches',
                create: { last_name: 'TestName' },
                query: { last_name: '!EQ:WrongName' },
                expected: 2,
            },
            {
                name: 'GT',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: { last_name: 'EQ:TestName', created_at: 'GT:2020-02-01T00:00:00.000Z' },
                expected: 1,
            },
            {
                name: 'GT with no matches',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: { last_name: 'EQ:TestName', created_at: 'GT:2022-02-01T00:00:00.000Z' },
                expected: 0,
            },
            {
                name: 'GTE',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: { last_name: 'EQ:TestName', created_at: 'GTE:2020-02-01T00:00:00.000Z' },
                expected: 1,
            },
            {
                name: 'GTE with exact match',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: { last_name: 'EQ:TestName', created_at: 'GTE:2021-02-01T00:00:00.000Z' },
                expected: 1,
            },
            {
                name: 'GTE with no matches',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: { last_name: 'EQ:TestName', created_at: 'GTE:2022-02-01T00:00:00.000Z' },
                expected: 0,
            },
            {
                name: 'LT',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: { last_name: 'EQ:TestName', created_at: 'LT:2022-02-01T00:00:00.000Z' },
                expected: 1,
            },
            {
                name: 'LT with exact matches',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: { last_name: 'EQ:TestName', created_at: 'LT:2021-02-01T00:00:00.000Z' },
                expected: 0,
            },
            {
                name: 'LT with no matches',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: { last_name: 'EQ:TestName', created_at: 'LT:2020-02-01T00:00:00.000Z' },
                expected: 0,
            },
            {
                name: 'LTE',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: { last_name: 'EQ:TestName', created_at: 'LTE:2022-02-01T00:00:00.000Z' },
                expected: 1,
            },
            {
                name: 'LTE with no matches',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: { last_name: 'EQ:TestName', created_at: 'LTE:2020-02-01T00:00:00.000Z' },
                expected: 0,
            },
            {
                name: 'Overloading operators: Overloading operators: GT and LT',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: {
                    last_name: 'EQ:TestName',
                    created_at: ['GT:2020-02-01T00:00:00.000Z', 'LT:2022-01-01T00:00:00.000Z'],
                },
                expected: 1,
            },
            {
                name: 'Overloading operators: GT and LT with no matches',
                create: { last_name: 'TestName', created_at: '2023-02-01T00:00:00.000Z' },
                query: {
                    last_name: 'EQ:TestName',
                    created_at: ['GT:2020-02-01T00:00:00.000Z', 'LT:2022-01-01T00:00:00.000Z'],
                },
                expected: 0,
            },
            {
                name: 'Overloading operators: GT and LT with no matches #2',
                create: { last_name: 'TestName', created_at: '2019-02-01T00:00:00.000Z' },
                query: {
                    last_name: 'EQ:TestName',
                    created_at: ['GT:2020-02-01T00:00:00.000Z', 'LT:2022-01-01T00:00:00.000Z'],
                },
                expected: 0,
            },
            {
                name: 'Overloading operators: GT, GTE and LT',
                create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
                query: {
                    last_name: 'EQ:TestName',
                    created_at: [
                        'GT:2020-02-01T00:00:00.000Z',
                        'GTE:2020-02-01T00:00:00.000Z',
                        'LT:2022-01-01T00:00:00.000Z',
                    ],
                },
                expected: 1,
            },
            {
                name: 'Overloading operators: GT, GTE and LT with no matches',
                create: { last_name: 'TestName', created_at: '2023-02-01T00:00:00.000Z' },
                query: {
                    last_name: 'EQ:TestName',
                    created_at: [
                        'GT:2020-02-01T00:00:00.000Z',
                        'GTE:2020-02-01T00:00:00.000Z',
                        'LT:2022-01-01T00:00:00.000Z',
                    ],
                },
                expected: 0,
            },
            {
                name: 'Overloading operators: GT, GTE and LT with no matches #2',
                create: { last_name: 'TestName', created_at: '2019-02-01T00:00:00.000Z' },
                query: {
                    last_name: 'EQ:TestName',
                    created_at: [
                        'GT:2020-02-01T00:00:00.000Z',
                        'GTE:2020-02-01T00:00:00.000Z',
                        'LT:2022-01-01T00:00:00.000Z',
                    ],
                },
                expected: 0,
            },
            {
                name: 'NULL',
                create: { last_name: null },
                query: { last_name: 'NULL' },
                expected: 1,
            },
            {
                name: 'NULL with no matches',
                create: { last_name: 'notNull' },
                query: { last_name: 'NULL' },
                expected: 0,
            },
            {
                name: '!NULL',
                create: { last_name: null },
                query: { last_name: '!NULL' },
                expected: 1,
            },
            {
                name: '!NULL with no matches',
                create: { last_name: 'notNull' },
                query: { last_name: '!NULL' },
                expected: 2,
            },
        ];
        testData.forEach(({ name, create, query, expected }) => {
            it(name, () => __awaiter(void 0, void 0, void 0, function* () {
                const u1 = yield userService.create(Object.assign(Object.assign({}, (0, test_1.MockUserRequest)(scaffold.values.account)), create));
                const result = yield testCharts(Object.assign({}, query));
                yield userService.purge(u1);
                expect(result['datasets'].length).toEqual(1);
                expect(result['datasets'][0]['data'].length).toEqual(expected);
            }));
        });
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
function getChartsIsoDate(date) {
    function pad(num) {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    }
    date || (date = new Date());
    return (date.getFullYear() +
        '-' +
        pad(date.getMonth() + 1) +
        '-' +
        pad(date.getDate()) +
        'T' +
        '00' +
        ':' +
        '00' +
        ':' +
        '00' +
        '.' +
        '000' +
        'Z');
}
//# sourceMappingURL=users.controller.charts.test.spec.js.map