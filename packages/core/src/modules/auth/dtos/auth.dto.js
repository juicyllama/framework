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
exports.AuthDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const users_enums_1 = require("../../users/users.enums");
class AuthDto {
}
exports.AuthDto = AuthDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: 'The user id',
        example: 1,
    }),
    __metadata("design:type", Number)
], AuthDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({
        description: 'The users email address',
        example: 'richard.branson@fly.virgin.com',
    }),
    __metadata("design:type", String)
], AuthDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(users_enums_1.UserRole),
    (0, swagger_1.ApiProperty)({
        description: 'The users role, only updatable by `ADMIN` and `OWNER` users',
        required: false,
        example: 'MEMBER',
    }),
    __metadata("design:type", String)
], AuthDto.prototype, "role", void 0);
//# sourceMappingURL=auth.dto.js.map