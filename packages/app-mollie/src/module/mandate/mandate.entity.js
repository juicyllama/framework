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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MollieMandate = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const customer_entity_1 = require("../customer/customer.entity");
const api_client_1 = require("@mollie/api-client");
const core_1 = require("@juicyllama/core");
let MollieMandate = exports.MollieMandate = class MollieMandate extends core_1.BaseEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MollieMandate.prototype, "mollie_mandate_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MollieMandate.prototype, "ext_mandate_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsEnum)(api_client_1.MandateStatus),
    __metadata("design:type", String)
], MollieMandate.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsEnum)(api_client_1.MandateMethod),
    __metadata("design:type", String)
], MollieMandate.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: null, nullable: true }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MollieMandate.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.MollieCustomer, customer => customer.mollie_customer_id, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'mollie_customer_id' }),
    __metadata("design:type", customer_entity_1.MollieCustomer)
], MollieMandate.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], MollieMandate.prototype, "last_check_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], MollieMandate.prototype, "next_check_at", void 0);
exports.MollieMandate = MollieMandate = __decorate([
    (0, typeorm_1.Entity)('apps_mollie_mandates'),
    __metadata("design:paramtypes", [Object])
], MollieMandate);
//# sourceMappingURL=mandate.entity.js.map