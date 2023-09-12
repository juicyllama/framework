var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
describe('Test Suite', () => {
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error(`Test suite should not be ran outside the test environment`);
        }
    }));
    describe('Jest Working...', () => {
        it('Test config works and runs tests', () => __awaiter(this, void 0, void 0, function* () {
            const foo = 'bar';
            expect(foo).toBe('bar');
        }));
    });
    afterAll(() => __awaiter(this, void 0, void 0, function* () { }));
});
//# sourceMappingURL=jest.test.spec.js.map