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
exports.UpdateAccountDto = exports.CreateAccountDto = exports.AccountDto = exports.OnboardAdditionalAccountDto = exports.OnboardAccountDto = exports.SuccessAccountDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const utils_1 = require("@juicyllama/utils");
class SuccessAccountDto {
}
exports.SuccessAccountDto = SuccessAccountDto;
class OnboardAccountDto {
}
exports.OnboardAccountDto = OnboardAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of your company', example: 'Virgin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], OnboardAccountDto.prototype, "account_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The account owners email address',
        example: 'owner@buq.com',
        required: true,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], OnboardAccountDto.prototype, "owners_email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(50),
    (0, swagger_1.ApiProperty)({
        example: 'S7r0#gP@$s',
        description: 'Only provide this for new users, existing users will use their existing password and this will be ignored',
    }),
    __metadata("design:type", String)
], OnboardAccountDto.prototype, "owners_password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Jon',
        description: 'The account owners first name, this will be ignored if the user already exists',
        required: false,
    }),
    __metadata("design:type", String)
], OnboardAccountDto.prototype, "owners_first_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Doe',
        description: 'The account owners last name, this will be ignored if the user already exists',
        required: false,
    }),
    __metadata("design:type", String)
], OnboardAccountDto.prototype, "owners_last_name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(utils_1.SupportedCurrencies),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(3),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: utils_1.SupportedCurrencies.USD,
        description: 'The default currency for your account.',
        enum: utils_1.SupportedCurrencies,
        required: false,
    }),
    __metadata("design:type", String)
], OnboardAccountDto.prototype, "currency", void 0);
class OnboardAdditionalAccountDto {
}
exports.OnboardAdditionalAccountDto = OnboardAdditionalAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of your company', example: 'Virgin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], OnboardAdditionalAccountDto.prototype, "account_name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(utils_1.SupportedCurrencies),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(3),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: utils_1.SupportedCurrencies.USD,
        description: 'The default currency for your account.',
        enum: utils_1.SupportedCurrencies,
        required: false,
    }),
    __metadata("design:type", String)
], OnboardAdditionalAccountDto.prototype, "currency", void 0);
class AccountDto {
}
exports.AccountDto = AccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of your company', example: 'Virgin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AccountDto.prototype, "account_name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(utils_1.SupportedCurrencies),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(3),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: utils_1.SupportedCurrencies.USD,
        description: 'The default currency for your account.',
        required: false,
    }),
    __metadata("design:type", String)
], AccountDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company Legal Trading Name', example: 'Virgin Limited' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AccountDto.prototype, "company_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company Registered Address Line 1', example: "Richard's House, PO Box 1091" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AccountDto.prototype, "address_1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company Registered Address Line 2', example: 'The Valley' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AccountDto.prototype, "address_2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company Registered City', example: 'Virgin Gorda' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AccountDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company Registered Post Code', example: null }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AccountDto.prototype, "postcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company Registered State', example: 'Necker Island' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AccountDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company Registered Country', example: 'VG' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(2),
    __metadata("design:type", String)
], AccountDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company Finance Email', example: 'finance@virgin.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AccountDto.prototype, "finance_email", void 0);
class CreateAccountDto extends AccountDto {
}
exports.CreateAccountDto = CreateAccountDto;
class UpdateAccountDto extends (0, swagger_1.PartialType)(AccountDto) {
}
exports.UpdateAccountDto = UpdateAccountDto;
//# sourceMappingURL=account.dto.js.map