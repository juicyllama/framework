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
const role_entity_1 = require("./role.entity");
const auth_module_1 = require("./auth.module");
const auth_service_1 = require("./auth.service");
const test_1 = require("../../test");
const users_enums_1 = require("../users/users.enums");
const E = role_entity_1.Role;
const MODULE = auth_module_1.AuthModule;
const SERVICE = auth_service_1.AuthService;
describe('Auth Service', () => {
    const scaffolding = new test_1.Scaffold();
    let scaffold;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
    }));
    describe('assignRole', () => {
        it('Change the role of a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.services.service.assignRole(scaffold.values.owner, scaffold.values.account, users_enums_1.UserRole.MEMBER);
            expect(result).toBeDefined();
            expect(result.email).toBeDefined();
            const role = yield scaffold.services.service.getRole(scaffold.values.owner.user_id, scaffold.values.account.account_id);
            expect(role.role).toBe(users_enums_1.UserRole.MEMBER);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
//# sourceMappingURL=auth.service.test.spec.js.map