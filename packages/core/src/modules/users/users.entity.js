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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const baseEntity_1 = require("../../helpers/baseEntity");
const account_entity_1 = require("../accounts/account.entity");
const users_enums_1 = require("./users.enums");
const role_entity_1 = require("../auth/role.entity");
let User = exports.User = class User extends baseEntity_1.BaseEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_transformer_1.Expose)({ groups: ['ADMIN', 'OWNER'] }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, class_validator_1.IsEmail)(),
    (0, class_transformer_1.Expose)({ groups: ['ADMIN', 'OWNER'] }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Expose)({ groups: ['ADMIN', 'OWNER'] }),
    __metadata("design:type", Boolean)
], User.prototype, "password_reset", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: users_enums_1.UserAvatarType.GRAVATAR }),
    (0, class_validator_1.IsEnum)(users_enums_1.UserAvatarType),
    __metadata("design:type", String)
], User.prototype, "avatar_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], User.prototype, "avatar_image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Expose)({ groups: ['ADMIN', 'OWNER'] }),
    __metadata("design:type", Date)
], User.prototype, "last_login_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => account_entity_1.Account, account => account.account_id),
    (0, typeorm_1.JoinTable)({
        name: 'users_accounts',
        joinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
        inverseJoinColumn: { name: 'account_id', referencedColumnName: 'account_id' },
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], User.prototype, "accounts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => role_entity_1.Role, role => role.user, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    __metadata("design:paramtypes", [Object])
], User);
//# sourceMappingURL=users.entity.js.map