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
exports.BeaconNotification = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../users/users.entity");
const account_entity_1 = require("../../accounts/account.entity");
const helpers_1 = require("../../../helpers");
let BeaconNotification = exports.BeaconNotification = class BeaconNotification extends helpers_1.BaseEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BeaconNotification.prototype, "notification_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => account_entity_1.Account, account => account.account_id, { cascade: false }),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", account_entity_1.Account)
], BeaconNotification.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => users_entity_1.User, user => user.user_id),
    (0, typeorm_1.JoinTable)({
        name: 'beacon_notification_users',
        joinColumn: { name: 'notification_id', referencedColumnName: 'notification_id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], BeaconNotification.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconNotification.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'mediumtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconNotification.prototype, "markdown", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconNotification.prototype, "unique", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], BeaconNotification.prototype, "removed_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, user => user.user_id, { cascade: false }),
    (0, typeorm_1.JoinColumn)({ name: 'removed_by_id' }),
    __metadata("design:type", users_entity_1.User)
], BeaconNotification.prototype, "removed_by", void 0);
exports.BeaconNotification = BeaconNotification = __decorate([
    (0, typeorm_1.Entity)('beacon_notification'),
    __metadata("design:paramtypes", [Object])
], BeaconNotification);
//# sourceMappingURL=notification.entity.js.map