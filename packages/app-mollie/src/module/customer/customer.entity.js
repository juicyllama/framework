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
exports.MollieCustomer = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const core_1 = require("@juicyllama/core");
let MollieCustomer = exports.MollieCustomer = class MollieCustomer extends core_1.BaseEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MollieCustomer.prototype, "mollie_customer_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MollieCustomer.prototype, "ext_customer_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => core_1.Account, account => account.account_id, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", core_1.Account)
], MollieCustomer.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], MollieCustomer.prototype, "last_check_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], MollieCustomer.prototype, "next_check_at", void 0);
exports.MollieCustomer = MollieCustomer = __decorate([
    (0, typeorm_1.Entity)('apps_mollie_customers'),
    (0, typeorm_1.Unique)('apps_mollie_customers_UNIQUE', ['account']),
    __metadata("design:paramtypes", [Object])
], MollieCustomer);
//# sourceMappingURL=customer.entity.js.map