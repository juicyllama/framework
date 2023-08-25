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
exports.UpdateUserDto = exports.CreateUserDto = exports.UserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UserDto {
}
exports.UserDto = UserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The users first name',
        example: 'Richard',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Branson',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'richard.branson@fly.virgin.com',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'S7rOngP@s7',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UserDto.prototype, "password_reset", void 0);
class CreateUserDto extends UserDto {
}
exports.CreateUserDto = CreateUserDto;
class UpdateUserDto extends (0, swagger_1.PartialType)(CreateUserDto) {
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=users.dto.js.map