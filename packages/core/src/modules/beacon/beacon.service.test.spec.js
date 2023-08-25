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
const beacon_service_1 = require("./beacon.service");
const beacon_module_1 = require("./beacon.module");
const test_1 = require("../../test");
const account_entity_1 = require("../accounts/account.entity");
const MODULE = beacon_module_1.BeaconModule;
const SERVICE = beacon_service_1.BeaconService;
const E = account_entity_1.Account;
describe('BeaconService', () => {
    const scaffolding = new test_1.Scaffold();
    let scaffold;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
    }));
    describe('Notify', () => {
        it('Send out a beacon', () => __awaiter(void 0, void 0, void 0, function* () {
            yield scaffold.services.service.notify({
                methods: {
                    email: true,
                },
                subject: `🏗️ Testing: ${process.env.npm_package_name} @ ${process.env.npm_package_version}`,
                communication: {
                    email: {
                        from: {
                            email: process.env.SYSTEM_EMAIL_ADDRESS,
                            name: process.env.SYSTEM_EMAIL_NAME,
                        },
                        to: {
                            email: process.env.SYSTEM_EMAIL_ADDRESS,
                            name: process.env.SYSTEM_EMAIL_NAME,
                        },
                    },
                },
                markdown: `### Hello World`,
            });
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
//# sourceMappingURL=beacon.service.test.spec.js.map