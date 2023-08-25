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
exports.Scaffold = exports.ScaffoldDto = void 0;
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const account_service_1 = require("../modules/accounts/account.service");
const utils_1 = require("@juicyllama/utils");
const mocks_1 = require("./mocks");
const closedown_1 = require("./closedown");
const configs_1 = require("../configs");
const account_module_1 = require("../modules/accounts/account.module");
const auth_module_1 = require("../modules/auth/auth.module");
const auth_service_1 = require("../modules/auth/auth.service");
const Query_1 = require("../utils/typeorm/Query");
const faker_1 = require("@faker-js/faker");
let httpServer;
let moduleRef;
let logger;
class ScaffoldDto {
}
exports.ScaffoldDto = ScaffoldDto;
class Scaffold {
    up(MODULE, SERVICE) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.Env.IsNotTest()) {
                throw new Error(`Test suite should not be ran outside the test environment`);
            }
            let accountService;
            let authService;
            let service;
            let query;
            let repository;
            let account;
            let owner;
            let owner_access_token;
            const password = faker_1.faker.internet.password(20, false, /[!-~]/);
            const imports = [(0, common_1.forwardRef)(() => account_module_1.AccountModule), (0, common_1.forwardRef)(() => auth_module_1.AuthModule)];
            if (MODULE) {
                imports.push((0, common_1.forwardRef)(() => MODULE));
            }
            try {
                moduleRef = yield testing_1.Test.createTestingModule({
                    imports: imports,
                    providers: [Query_1.Query, utils_1.Logger],
                }).compile();
            }
            catch (e) {
                console.error(e.message, e);
            }
            const app = moduleRef.createNestApplication();
            app.useGlobalPipes(new common_1.ValidationPipe(configs_1.validationPipeOptions));
            yield app.init();
            httpServer = app.getHttpServer();
            accountService = yield moduleRef.resolve(account_service_1.AccountService);
            authService = yield moduleRef.resolve(auth_service_1.AuthService);
            logger = yield moduleRef.resolve(utils_1.Logger);
            query = yield moduleRef.resolve((Query_1.Query));
            if (SERVICE) {
                service = yield moduleRef.resolve(SERVICE);
                repository = service.repository;
            }
            const result = yield accountService.onboard((0, mocks_1.MockAccountRequest)(password));
            account = result.account;
            owner = result.owner;
            const auth = yield authService.login(owner);
            owner_access_token = auth.access_token;
            return {
                server: httpServer,
                module: moduleRef,
                query: query,
                repository: repository,
                services: {
                    accountService: accountService,
                    authService: authService,
                    logger: logger,
                    service: service,
                },
                values: {
                    account: account,
                    owner: owner,
                    owner_access_token: owner_access_token,
                    owner_password: password,
                    record: undefined,
                    mock: undefined,
                },
            };
        });
    }
    down(E) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, closedown_1.testCleanup)(moduleRef, E);
            }
            catch (e) {
                logger.warn(e.message, e);
            }
        });
    }
}
exports.Scaffold = Scaffold;
//# sourceMappingURL=scaffold.js.map