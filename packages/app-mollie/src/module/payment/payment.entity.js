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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MolliePayment = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const customer_entity_1 = require("../customer/customer.entity");
const mandate_entity_1 = require("../mandate/mandate.entity");
const utils_1 = require("@juicyllama/utils");
const api_client_1 = require("@mollie/api-client");
const core_1 = require("@juicyllama/core");
let MolliePayment = exports.MolliePayment = class MolliePayment extends core_1.BaseEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MolliePayment.prototype, "mollie_payment_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MolliePayment.prototype, "ext_payment_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsEnum)(api_client_1.PaymentStatus),
    __metadata("design:type", String)
], MolliePayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], MolliePayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3 }),
    (0, class_validator_1.IsEnum)(utils_1.SupportedCurrencies),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", typeof (_a = typeof utils_1.SupportedCurrencies !== "undefined" && utils_1.SupportedCurrencies) === "function" ? _a : Object)
], MolliePayment.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsEnum)(api_client_1.PaymentMethod),
    __metadata("design:type", String)
], MolliePayment.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.MollieCustomer, customer => customer.mollie_customer_id, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'mollie_customer_id' }),
    __metadata("design:type", customer_entity_1.MollieCustomer)
], MolliePayment.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => mandate_entity_1.MollieMandate, mandate => mandate.mollie_mandate_id, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'mollie_mandate_id' }),
    __metadata("design:type", mandate_entity_1.MollieMandate)
], MolliePayment.prototype, "mandate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], MolliePayment.prototype, "last_check_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], MolliePayment.prototype, "next_check_at", void 0);
exports.MolliePayment = MolliePayment = __decorate([
    (0, typeorm_1.Entity)('apps_mollie_payments'),
    __metadata("design:paramtypes", [Object])
], MolliePayment);
//# sourceMappingURL=payment.entity.js.map