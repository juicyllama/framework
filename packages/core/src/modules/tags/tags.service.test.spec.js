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
const tags_entity_1 = require("./tags.entity");
const tags_service_1 = require("./tags.service");
const test_1 = require("../../test");
const tags_module_1 = require("./tags.module");
const E = tags_entity_1.Tag;
const MODULE = tags_module_1.TagsModule;
const SERVICE = tags_service_1.TagsService;
const tag = faker_1.faker.random.word().toUpperCase();
describe('TagsService', () => {
    const scaffolding = new test_1.Scaffold();
    let scaffold;
    let tags;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
    }));
    describe('Create Tag', () => {
        it('Should create a new tag', () => __awaiter(void 0, void 0, void 0, function* () {
            yield scaffold.services.service.create(tag);
            tags = yield scaffold.services.service.findAll();
            expect(tags[0].name).toBe(tag);
        }));
    });
    describe('Create From String', () => {
        it('Should create a number of tags and return them', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scaffold.services.service.createFromStrings(['test', 'test2', 'test3']);
            expect(result[0].name).toBe('test'.toUpperCase());
            expect(result[1].name).toBe('test2'.toUpperCase());
            expect(result[2].name).toBe('test3'.toUpperCase());
        }));
    });
    describe('Retrieve', () => {
        it('Should get all tags', () => __awaiter(void 0, void 0, void 0, function* () {
            tags = yield scaffold.services.service.findAll();
            expect(tags[0].name).toBeDefined();
        }));
        it('Find by name', () => __awaiter(void 0, void 0, void 0, function* () {
            const t = yield scaffold.services.service.findByName(tag);
            expect(t.name).toBe(tag);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
//# sourceMappingURL=tags.service.test.spec.js.map