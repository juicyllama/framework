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
const testing_1 = require("@nestjs/testing");
const utils_1 = require("@juicyllama/utils");
const core_module_1 = require("./core.module");
describe('Core Bootup', () => {
    let moduleRef;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (utils_1.Env.IsNotTest()) {
            throw new Error(`Test suite should not be ran outside the test environment`);
        }
    }));
    describe('Start App', () => {
        it('Does it boot up without issue?', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                moduleRef = yield testing_1.Test.createTestingModule({
                    imports: [core_module_1.CoreModule],
                    controllers: [],
                    providers: [],
                }).compile();
            }
            catch (e) {
                expect(e.message).toEqual('Bootup failed');
            }
        }));
    });
});
//# sourceMappingURL=core.module.test.spec.js.map