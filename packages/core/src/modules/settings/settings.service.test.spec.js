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
const settings_entity_1 = require("./settings.entity");
const settings_service_1 = require("./settings.service");
const faker_1 = require("@faker-js/faker");
const test_1 = require("../../test");
const settings_module_1 = require("./settings.module");
const E = settings_entity_1.Setting;
const MODULE = settings_module_1.SettingsModule;
const SERVICE = settings_service_1.SettingsService;
const mock = {
    key: faker_1.faker.random.word(),
    value: { name: faker_1.faker.name.fullName() },
};
describe('SettingsService', () => {
    const scaffolding = new test_1.Scaffold();
    let scaffold;
    let settings;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
    }));
    describe('Create Setting', () => {
        it('Should create a new setting', () => __awaiter(void 0, void 0, void 0, function* () {
            yield scaffold.services.service.create(mock.key, mock.value);
            settings = yield scaffold.services.service.findAll();
            expect(settings[0].key).toBe(mock.key);
        }));
    });
    describe('Retrieve', () => {
        it('Should get all settings', () => __awaiter(void 0, void 0, void 0, function* () {
            settings = yield scaffold.services.service.findAll();
            expect(settings[0].key).toBe(mock.key);
        }));
        it('Should get one setting', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.services.service.findOne(mock.key);
            expect(result.key).toBe(mock.key);
        }));
        it('Should get one setting value', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.services.service.findValue(mock.key);
            expect(result.name).toBe(mock.value.name);
        }));
    });
    describe('Update Setting', () => {
        it('Should update existing setting', () => __awaiter(void 0, void 0, void 0, function* () {
            const value = { name: faker_1.faker.name.fullName() };
            yield scaffold.services.service.update(mock.key, value);
            const result = yield scaffold.services.service.findValue(mock.key);
            expect(result.name).toBe(value.name);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
//# sourceMappingURL=settings.service.test.spec.js.map