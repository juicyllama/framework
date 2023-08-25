"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const utils_1 = require("@juicyllama/utils");
const api_client_1 = require("@mollie/api-client");
const config_1 = require("@nestjs/config");
const customer_mock_1 = __importDefault(require("./customer.mock"));
const core_1 = require("@juicyllama/core");
const E = customer_entity_1.MollieCustomer;
let CustomerService = exports.CustomerService = class CustomerService extends core_1.BaseService {
    constructor(repository, logger, query, configService) {
        super(query, repository);
        this.repository = repository;
        this.logger = logger;
        this.query = query;
        this.configService = configService;
    }
    create(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.findByAccount(account);
            if (result) {
                return result;
            }
            let mollie_response;
            try {
                if (utils_1.Enviroment[process.env.NODE_ENV] === utils_1.Enviroment.test) {
                    this.logger.verbose(`[Test] Mock mollie customer`);
                    mollie_response = (0, customer_mock_1.default)();
                }
                else {
                    this.logger.debug(`Create mollie customer`, account);
                    const mollieClient = (0, api_client_1.createMollieClient)({
                        apiKey: this.configService.get('mollie.MOLLIE_API_KEY'),
                    });
                    mollie_response = yield mollieClient.customers.create({
                        name: `${account.company_name} (${account.account_id})`,
                        metadata: {
                            account_id: account.account_id,
                        },
                    });
                    this.logger.debug(`Create mollie customer response: `, mollie_response);
                }
                if (!mollie_response.id) {
                    this.logger.error(`Error: Mollie customer ID not in the response`, {
                        mollie_response: mollie_response,
                        account: account,
                    });
                    new Error(`Mollie customer ID not in the response`);
                }
                return yield this.query.create(this.repository, {
                    ext_customer_id: mollie_response.id,
                    account: account,
                });
            }
            catch (e) {
                this.logger.error(`Error: ${e.message}`, {
                    error: {
                        message: e.message,
                        request: {
                            account: account,
                        },
                    },
                });
            }
        });
    }
    findByAccount(account) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.findOne(this.repository, {
                where: {
                    account: {
                        account_id: account.account_id,
                    },
                },
            });
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new common_1.BadRequestException(`You cannot delete a customer as it is linked to an external service`);
        });
    }
};
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(E)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => core_1.Query))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => config_1.ConfigService))),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof utils_1.Logger !== "undefined" && utils_1.Logger) === "function" ? _a : Object, core_1.Query,
        config_1.ConfigService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map