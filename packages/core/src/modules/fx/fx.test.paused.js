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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const config_1 = require("@nestjs/config");
const utils_2 = require("@juicyllama/utils");
const fx_service_1 = require("./fx.service");
const fx_entity_1 = require("./fx.entity");
const database_config_1 = __importDefault(require("../../configs/database.config"));
const cache_config_1 = __importDefault(require("../../configs/cache.config"));
const closedown_1 = require("../../test/closedown");
const Query_1 = require("../../utils/typeorm/Query");
const Cache_1 = require("../../utils/typeorm/Cache");
describe('TagsService', () => {
    let fxService;
    let moduleRef;
    let cacheService;
    let fxRates;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (utils_2.Enviroment[process.env.NODE_ENV] !== utils_2.Enviroment.test) {
            throw new Error(`Test suite should not be ran outside the test environment`);
        }
        moduleRef = yield testing_1.Test.createTestingModule({
            imports: [
                config_1.ConfigModule.forRoot({
                    load: [database_config_1.default, cache_config_1.default],
                    isGlobal: true,
                }),
                common_1.CacheModule.registerAsync((0, cache_config_1.default)()),
                typeorm_1.TypeOrmModule.forRoot((0, database_config_1.default)()),
                typeorm_1.TypeOrmModule.forFeature([fx_entity_1.FxRate]),
            ],
            providers: [fx_service_1.FxService, utils_1.Logger, Query_1.Query, Cache_1.CacheService],
        }).compile();
        fxService = moduleRef.get(fx_service_1.FxService);
    }));
    describe('Convert', () => {
        it('Should return a correct conversion', () => __awaiter(void 0, void 0, void 0, function* () {
            const GBPtoUSD = yield fxService.convert(100, utils_2.SupportedCurrencies.GBP, utils_2.SupportedCurrencies.USD);
            expect(GBPtoUSD).toEqual(110.78675212018148);
            const USDtoGBP = yield fxService.convert(100, utils_2.SupportedCurrencies.USD, utils_2.SupportedCurrencies.GBP);
            expect(USDtoGBP).toEqual(90.2635);
            const USDtoUSD = yield fxService.convert(100, utils_2.SupportedCurrencies.USD, utils_2.SupportedCurrencies.USD);
            expect(USDtoUSD).toEqual(100);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, closedown_1.testCleanup)(moduleRef, fx_entity_1.FxRate);
    }));
});
//# sourceMappingURL=fx.test.paused.js.map