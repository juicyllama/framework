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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const utils_1 = require("@juicyllama/utils");
const payment_entity_1 = require("./payment.entity");
const config_1 = require("@nestjs/config");
const api_client_1 = require("@mollie/api-client");
const mandate_service_1 = require("../mandate/mandate.service");
const payment_mock_1 = __importDefault(require("./payment.mock"));
const customer_service_1 = require("../customer/customer.service");
const core_1 = require("@juicyllama/core");
const mollie_mapper_1 = require("../mollie.mapper");
const billing_1 = require("@juicyllama/billing");
const E = payment_entity_1.MolliePayment;
let PaymentService = exports.PaymentService = class PaymentService extends core_1.BaseService {
    constructor(logger, query, repository, configService, customerService, mandateService, paymentsService) {
        super(query, repository);
        this.logger = logger;
        this.query = query;
        this.repository = repository;
        this.configService = configService;
        this.customerService = customerService;
        this.mandateService = mandateService;
        this.paymentsService = paymentsService;
    }
    createFirstPayment(data, description) {
        return __awaiter(this, void 0, void 0, function* () {
            let mollie_payment = yield this.query.create(this.repository, Object.assign(Object.assign({}, data), { method: api_client_1.PaymentMethod.creditcard, status: api_client_1.PaymentStatus.pending }));
            if (!mollie_payment.customer) {
                mollie_payment = yield this.findById(mollie_payment.mollie_payment_id);
            }
            if (!mollie_payment.customer.account) {
                mollie_payment.customer = yield this.customerService.findById(mollie_payment.customer.mollie_customer_id);
            }
            let mollie_response;
            try {
                if (utils_1.Enviroment[process.env.NODE_ENV] === utils_1.Enviroment.test) {
                    this.logger.verbose(`[Test] Mock mollie payment`);
                    mollie_response = (0, payment_mock_1.default)(mollie_payment);
                }
                else {
                    this.logger.debug(`Create mollie payment`, mollie_payment);
                    const mollieClient = (0, api_client_1.createMollieClient)({
                        apiKey: this.configService.get('mollie.MOLLIE_API_KEY'),
                    });
                    mollie_response = yield mollieClient.payments.create({
                        amount: {
                            value: mollie_payment.amount.toString(),
                            currency: mollie_payment.currency,
                        },
                        description: description !== null && description !== void 0 ? description : `Add Card - Account #${mollie_payment.customer.account.account_id}`,
                        metadata: {
                            account_id: mollie_payment.customer.account.account_id,
                            customer_id: mollie_payment.customer.mollie_customer_id,
                        },
                        method: api_client_1.PaymentMethod.creditcard,
                        customerId: mollie_payment.customer.ext_customer_id,
                        sequenceType: api_client_1.SequenceType.first,
                        redirectUrl: `${this.configService.get('BASE_URL_API')}/app/mollie/payment/redirect/${mollie_payment.mollie_payment_id}`,
                        webhookUrl: `${this.configService.get('BASE_URL_API')}/app/mollie/payment/webhook/${mollie_payment.mollie_payment_id}`,
                    });
                    this.logger.debug(`Mollie payment response for first payment attempt: `, mollie_response);
                }
            }
            catch (e) {
                this.logger.error(`Error: ${e.message}`, {
                    error: {
                        message: e.message,
                        request: {
                            mollie_payment: mollie_payment,
                        },
                    },
                });
            }
            if (!mollie_response.id) {
                this.logger.error(`Mollie payment ID not in the response`);
                return;
            }
            yield this.update({
                mollie_payment_id: mollie_payment.mollie_payment_id,
                ext_payment_id: mollie_response.id,
                status: mollie_response.status,
            });
            return mollie_response._links.checkout.href;
        });
    }
    syncPayment(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            let mollie_response;
            if (!payment.customer) {
                payment = yield this.findById(payment.mollie_payment_id);
            }
            if (!payment.customer.account) {
                payment.customer = yield this.customerService.findById(payment.customer.mollie_customer_id);
            }
            try {
                if (utils_1.Enviroment[process.env.NODE_ENV] === utils_1.Enviroment.test) {
                    this.logger.verbose(`[Test] Mock mollie payment`);
                    mollie_response = (0, payment_mock_1.default)(payment);
                }
                else {
                    this.logger.debug(`Get mollie payment`, payment);
                    const mollieClient = (0, api_client_1.createMollieClient)({
                        apiKey: this.configService.get('mollie.MOLLIE_API_KEY'),
                    });
                    mollie_response = yield mollieClient.payments.get(payment.ext_payment_id);
                    this.logger.debug(`Get mollie payment response: `, mollie_response);
                }
            }
            catch (e) {
                this.logger.error(`Error: ${e.message}`, {
                    error: {
                        message: e.message,
                        request: {
                            payment: payment,
                        },
                    },
                });
            }
            if (!mollie_response.id) {
                this.logger.error(`Error: Mollie payment ID not in the response`, {
                    mollie_response: mollie_response,
                    payment: payment,
                });
                new Error(`Mollie payment ID not in the response`);
            }
            payment = yield this.linkMandate(payment, mollie_response);
            yield this.update({
                mollie_payment_id: payment.mollie_payment_id,
                status: mollie_response.status,
            });
            payment.status = mollie_response.status;
            yield this.pushPaymentToBillingSystem(payment);
            return payment;
        });
    }
    createPayment(amount, currency, account, mandate) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield this.customerService.findByAccount(account);
            if (!mandate) {
                mandate = yield this.mandateService.findOne({
                    where: {
                        customer: {
                            mollie_customer_id: customer.mollie_customer_id,
                        },
                    },
                    order: {
                        created_at: 'DESC',
                    },
                });
            }
            let mollie_payment = yield this.query.create(this.repository, {
                mandate: mandate,
                customer: customer,
                amount: amount,
                currency: currency,
                method: api_client_1.PaymentMethod.creditcard,
                status: api_client_1.PaymentStatus.pending,
            });
            let mollie_response;
            try {
                if (utils_1.Enviroment[process.env.NODE_ENV] === utils_1.Enviroment.test) {
                    this.logger.verbose(`[Test] Mock mollie payment`);
                    mollie_response = (0, payment_mock_1.default)(mollie_payment);
                }
                else {
                    this.logger.debug(`Create mollie payment`, mollie_payment);
                    const mollieClient = (0, api_client_1.createMollieClient)({
                        apiKey: this.configService.get('mollie.MOLLIE_API_KEY'),
                    });
                    mollie_response = yield mollieClient.payments.create({
                        amount: {
                            value: mollie_payment.amount.toString(),
                            currency: mollie_payment.currency,
                        },
                        description: `Charge Card - Mandate #${mandate.mollie_mandate_id}`,
                        metadata: {
                            account_id: account.account_id,
                            customer_id: customer.mollie_customer_id,
                            mandate_id: mandate.mollie_mandate_id,
                        },
                        method: api_client_1.PaymentMethod.creditcard,
                        mandateId: mandate.ext_mandate_id,
                        customerId: customer.ext_customer_id,
                        sequenceType: api_client_1.SequenceType.recurring,
                        webhookUrl: `${this.configService.get('BASE_URL_API')}/app/mollie/payment/webhook/${mollie_payment.mollie_payment_id}`,
                    });
                    this.logger.debug(`Create mollie payment response: `, mollie_response);
                }
            }
            catch (e) {
                this.logger.error(`Error: ${e.message}`, {
                    error: {
                        message: e.message,
                        request: {
                            mollie_payment: mollie_payment,
                        },
                    },
                });
            }
            if (!mollie_response.id) {
                this.logger.error(`Mollie payment ID not in the response`);
                return;
            }
            mollie_payment.ext_payment_id = mollie_response.id;
            mollie_payment.status = mollie_response.status;
            yield this.update({
                mollie_payment_id: mollie_payment.mollie_payment_id,
                ext_payment_id: mollie_response.id,
                status: mollie_response.status,
            });
            mollie_payment = yield this.linkMandate(mollie_payment, mollie_response);
            yield this.pushPaymentToBillingSystem(mollie_payment);
            return mollie_payment;
        });
    }
    pushPaymentToBillingSystem(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'app::mollie::payment::pushPaymentToBillingSystem';
            if (utils_1.Env.IsTest()) {
                this.logger.verbose(`[${domain}] Skipping push payment to billing system in test env`);
                return;
            }
            if (!payment.amount) {
                this.logger.error(`[${domain}] Payment amount is not set`, payment);
                return;
            }
            yield this.paymentsService.paymentResponse(core_1.AppIntegrationName.mollie, payment.mandate.mollie_mandate_id, payment.mollie_payment_id, payment.amount, payment.currency, (0, mollie_mapper_1.molliePaymentStatus)(payment.status), payment.amount >= 0 ? billing_1.PaymentType.payment : billing_1.PaymentType.refund);
            this.logger.verbose(`[${domain}] Pushing payment response`, {
                app_integration_name: core_1.AppIntegrationName.mollie,
                mollie_mandate_id: payment.mandate.mollie_mandate_id,
                mollie_payment_id: payment.mollie_payment_id,
                amount: payment.amount,
                currency: payment.currency,
                status: (0, mollie_mapper_1.molliePaymentStatus)(payment.status),
                type: payment.amount >= 0 ? billing_1.PaymentType.payment : billing_1.PaymentType.refund,
            });
        });
    }
    linkMandate(payment, mollie_response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!payment.mandate && mollie_response.mandateId) {
                const mandate = yield this.mandateService.create({
                    ext_mandate_id: mollie_response.mandateId,
                    customer: payment.customer,
                });
                yield this.update({
                    mollie_payment_id: payment.mollie_payment_id,
                    mandate: mandate,
                });
                payment.mandate = mandate;
            }
            payment.mandate = yield this.mandateService.syncMandate(payment.mandate);
            return payment;
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new common_1.BadRequestException(`You cannot delete a customer as it is linked to an external service`);
        });
    }
};
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => core_1.Query))),
    __param(2, (0, typeorm_1.InjectRepository)(E)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => config_1.ConfigService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => customer_service_1.CustomerService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => mandate_service_1.MandateService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => billing_1.PaymentsService))),
    __metadata("design:paramtypes", [typeof (_a = typeof utils_1.Logger !== "undefined" && utils_1.Logger) === "function" ? _a : Object, core_1.Query,
        typeorm_2.Repository,
        config_1.ConfigService,
        customer_service_1.CustomerService,
        mandate_service_1.MandateService,
        billing_1.PaymentsService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map