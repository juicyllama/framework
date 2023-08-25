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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_service_1 = require("./payment.service");
const mollie_mapper_1 = require("../mollie.mapper");
const customer_service_1 = require("../customer/customer.service");
const mandate_service_1 = require("../mandate/mandate.service");
let PaymentController = exports.PaymentController = class PaymentController {
    constructor(paymentService, mandateService, customerService) {
        this.paymentService = paymentService;
        this.mandateService = mandateService;
        this.customerService = customerService;
    }
    addRedirect(id, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentService.findById(id);
            yield this.paymentService.syncPayment(payment);
            const mollieCustomer = yield this.customerService.findById(payment.customer.mollie_customer_id);
            res.redirect(`${process.env.BASE_URL_API}/billing/payment/methods/redirect/${mollieCustomer.account.account_id}/${payment.mandate.mollie_mandate_id}/${(0, mollie_mapper_1.molliePaymentStatus)(payment.status)}`);
        });
    }
    paymentWebhook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentService.findById(id);
            yield this.paymentService.syncPayment(payment);
        });
    }
};
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, common_1.Get)('redirect/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "addRedirect", null);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, common_1.Post)('webhook/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "paymentWebhook", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('app/mollie/payment'),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => payment_service_1.PaymentService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => mandate_service_1.MandateService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => customer_service_1.CustomerService))),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        mandate_service_1.MandateService,
        customer_service_1.CustomerService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map