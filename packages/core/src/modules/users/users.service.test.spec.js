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
const users_service_1 = require("./users.service");
const users_entity_1 = require("./users.entity");
const test_1 = require("../../test");
const users_module_1 = require("./users.module");
const E = users_entity_1.User;
const MODULE = users_module_1.UsersModule;
const SERVICE = users_service_1.UsersService;
describe('Users Service', () => {
    const scaffolding = new test_1.Scaffold();
    let scaffold;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
    }));
    describe('Read', () => {
        it('findOneByEmail', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.services.service.findOneByEmail(scaffold.values.owner.email);
            expect(result).toBeDefined();
            expect(result.email).toEqual(scaffold.values.owner.email);
        }));
    });
    describe('Validation', () => {
        it('validateUser', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.services.service.validateUser(scaffold.values.owner.email, scaffold.values.owner_password);
            expect(result).toBeDefined();
            expect(result.email).toEqual(scaffold.values.owner.email);
        }));
        it('validateEmail', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.services.service.validateEmail(scaffold.values.owner.email);
            expect(result).toBeDefined();
            expect(result.email).toEqual(scaffold.values.owner.email);
        }));
        it('getValidatedUserByEmail', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.services.service.getValidatedUserByEmail(scaffold.values.owner.email);
            expect(result).toBeDefined();
            expect(result.email).toEqual(scaffold.values.owner.email);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
//# sourceMappingURL=users.service.test.spec.js.map