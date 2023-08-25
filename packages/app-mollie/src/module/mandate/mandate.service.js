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
exports.MandateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mandate_entity_1 = require("./mandate.entity");
const utils_1 = require("@juicyllama/utils");
const api_client_1 = require("@mollie/api-client");
const mandate_mock_1 = __importDefault(require("./mandate.mock"));
const config_1 = require("@nestjs/config");
const core_1 = require("@juicyllama/core");
const customer_service_1 = require("../customer/customer.service");
const E = mandate_entity_1.MollieMandate;
let MandateService = exports.MandateService = class MandateService extends core_1.BaseService {
    constructor(repository, logger, query, customerService, configService) {
        super(query, repository);
        this.repository = repository;
        this.logger = logger;
        this.query = query;
        this.customerService = customerService;
        this.configService = configService;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.findOne({
                where: {
                    ext_mandate_id: data.ext_mandate_id,
                },
            });
            if (result) {
                return result;
            }
            return yield this.query.create(this.repository, data);
        });
    }
    syncMandate(mandate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mandate.customer) {
                mandate = yield this.findById(mandate.mollie_mandate_id);
            }
            let mollie_response;
            try {
                if (utils_1.Enviroment[process.env.NODE_ENV] === utils_1.Enviroment.test) {
                    this.logger.verbose(`[Test] Mock mollie mandate`);
                    mollie_response = (0, mandate_mock_1.default)();
                }
                else {
                    this.logger.debug(`Get mollie mandate`, {
                        mandate: mandate,
                    });
                    const mollieClient = (0, api_client_1.createMollieClient)({
                        apiKey: this.configService.get('mollie.MOLLIE_API_KEY'),
                    });
                    mollie_response = yield mollieClient.customerMandates.get(mandate.ext_mandate_id, {
                        customerId: mandate.customer.ext_customer_id,
                    });
                    this.logger.debug(`Get mollie mandate response: `, mollie_response);
                }
            }
            catch (e) {
                this.logger.error(`Error: ${e.message}`, {
                    error: {
                        message: e.message,
                        request: {
                            mandate: mandate,
                        },
                    },
                });
            }
            if (!mollie_response.id) {
                this.logger.error(`Error: Mollie mandate ID not in the response`, {
                    mollie_response: mollie_response,
                    mandate: mandate,
                });
            }
            return yield this.update({
                mollie_mandate_id: mandate.mollie_mandate_id,
                status: mollie_response.status,
                method: mollie_response.method,
                details: mollie_response.details,
            });
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new common_1.BadRequestException(`You cannot delete a customer as it is linked to an external service`);
        });
    }
};
exports.MandateService = MandateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(E)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => core_1.Query))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => customer_service_1.CustomerService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => config_1.ConfigService))),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof utils_1.Logger !== "undefined" && utils_1.Logger) === "function" ? _a : Object, core_1.Query,
        customer_service_1.CustomerService,
        config_1.ConfigService])
], MandateService);
//# sourceMappingURL=mandate.service.js.map