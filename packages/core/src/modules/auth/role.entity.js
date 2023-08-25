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
exports.Role = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const baseEntity_1 = require("../../helpers/baseEntity");
const account_entity_1 = require("../accounts/account.entity");
const users_entity_1 = require("../users/users.entity");
const users_enums_1 = require("../users/users.enums");
const typeorm_2 = require("typeorm");
let Role = exports.Role = class Role extends baseEntity_1.BaseEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Role.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, user => user.user_id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", users_entity_1.User)
], Role.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Role.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => account_entity_1.Account, account => account.account_id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", account_entity_1.Account)
], Role.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Role.prototype, "account_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(users_enums_1.UserRole),
    (0, typeorm_1.Column)({ default: users_enums_1.UserRole.MEMBER }),
    __metadata("design:type", String)
], Role.prototype, "role", void 0);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)('users_accounts_roles'),
    (0, typeorm_2.Unique)('users_accounts_roles_UNIQUE', ['user', 'account']),
    __metadata("design:paramtypes", [Object])
], Role);
//# sourceMappingURL=role.entity.js.map