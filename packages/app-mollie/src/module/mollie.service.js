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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MollieService = void 0;
const common_1 = require("@nestjs/common");
const customer_service_1 = require("./customer/customer.service");
const payment_service_1 = require("./payment/payment.service");
const mandate_service_1 = require("./mandate/mandate.service");
const utils_1 = require("@juicyllama/utils");
let MollieService = exports.MollieService = class MollieService {
    constructor(customerService, mandateService, paymentService, logger) {
        this.customerService = customerService;
        this.mandateService = mandateService;
        this.paymentService = paymentService;
        this.logger = logger;
    }
    addCard(account, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const mollie_customer = yield this.customerService.create(account);
            return yield this.paymentService.createFirstPayment({
                amount: 0.0,
                currency: account.currency,
                customer: mollie_customer,
            }, description);
        });
    }
    listCards(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const mollie_customer = yield this.customerService.findByAccount(account);
            if (!mollie_customer) {
                this.logger.error(`Cannot find mollie customer from account #${account.account_id}`, account);
                return;
            }
            return yield this.mandateService.findAll({
                where: {
                    customer: {
                        mollie_customer_id: mollie_customer.mollie_customer_id,
                    },
                },
            });
        });
    }
    charge(amount, currency, account, mollie_mandate_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mandate = yield this.mandateService.findById(mollie_mandate_id);
            if (!mandate) {
                throw new common_1.BadRequestException(`Cannot find mandate with mollie_mandate_id #${mollie_mandate_id}`);
            }
            return yield this.paymentService.createPayment(amount, currency, account, mandate);
        });
    }
    getPayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.paymentService.findById(id);
        });
    }
};
exports.MollieService = MollieService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => customer_service_1.CustomerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => mandate_service_1.MandateService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => payment_service_1.PaymentService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __metadata("design:paramtypes", [customer_service_1.CustomerService,
        mandate_service_1.MandateService,
        payment_service_1.PaymentService, typeof (_a = typeof utils_1.Logger !== "undefined" && utils_1.Logger) === "function" ? _a : Object])
], MollieService);
//# sourceMappingURL=mollie.service.js.map