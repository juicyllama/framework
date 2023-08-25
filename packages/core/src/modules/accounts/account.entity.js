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
exports.Account = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const baseEntity_1 = require("../../helpers/baseEntity");
const utils_1 = require("@juicyllama/utils");
const tags_entity_1 = require("../tags/tags.entity");
const role_entity_1 = require("../auth/role.entity");
let Account = exports.Account = class Account extends baseEntity_1.BaseEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Account.prototype, "account_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Account.prototype, "account_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: utils_1.SupportedCurrencies.USD }),
    (0, class_validator_1.IsEnum)(utils_1.SupportedCurrencies),
    __metadata("design:type", String)
], Account.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Account.prototype, "company_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Account.prototype, "address_1", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Account.prototype, "address_2", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Account.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Account.prototype, "postcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Account.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(2),
    __metadata("design:type", String)
], Account.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], Account.prototype, "finance_email", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], Account.prototype, "customer_service_email", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], Account.prototype, "avatar_image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Account.prototype, "onboarding_step", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Account.prototype, "onboarding_complete", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => tags_entity_1.Tag, tag => tag, { cascade: true }),
    (0, typeorm_1.JoinTable)({
        name: 'account_tags',
        joinColumn: { name: 'account_id', referencedColumnName: 'account_id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' },
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Account.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => role_entity_1.Role, role => role.account, { cascade: true }),
    __metadata("design:type", Array)
], Account.prototype, "roles", void 0);
exports.Account = Account = __decorate([
    (0, typeorm_1.Entity)('accounts'),
    __metadata("design:paramtypes", [Object])
], Account);
//# sourceMappingURL=account.entity.js.map