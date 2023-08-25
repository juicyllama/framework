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
exports.ValidateCodeDto = exports.LoginRequestDto = exports.LoginResponseDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class LoginResponseDto {
    constructor(token) {
        this.access_token = token;
    }
}
exports.LoginResponseDto = LoginResponseDto;
class LoginRequestDto {
}
exports.LoginRequestDto = LoginRequestDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: 'The users email address',
        example: 'richard.branson@fly.virgin.com',
    }),
    __metadata("design:type", String)
], LoginRequestDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'S7rOngP@s7',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], LoginRequestDto.prototype, "password", void 0);
class ValidateCodeDto {
}
exports.ValidateCodeDto = ValidateCodeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ValidateCodeDto.prototype, "code", void 0);
//# sourceMappingURL=login.dto.js.map