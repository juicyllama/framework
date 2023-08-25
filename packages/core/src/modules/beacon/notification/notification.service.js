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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconNotificationService = void 0;
const common_1 = require("@nestjs/common");
const notification_entity_1 = require("./notification.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Query_1 = require("../../../utils/typeorm/Query");
const helpers_1 = require("../../../helpers");
const utils_1 = require("@juicyllama/utils");
const users_service_1 = require("../../users/users.service");
const push_service_1 = require("../push/push.service");
const users_enums_1 = require("../../users/users.enums");
const auth_service_1 = require("../../auth/auth.service");
const E = notification_entity_1.BeaconNotification;
let BeaconNotificationService = exports.BeaconNotificationService = class BeaconNotificationService extends helpers_1.BaseService {
    constructor(query, repository, logger, beaconPushService, authService, usersService) {
        super(query, repository);
        this.query = query;
        this.repository = repository;
        this.logger = logger;
        this.beaconPushService = beaconPushService;
        this.authService = authService;
        this.usersService = usersService;
    }
    create(message) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'utils::beacon::notification::create';
            this.logger.debug(`[${domain}] Beacon Notification`, message);
            let users = yield this.usersService.findAll({
                where: {
                    roles: {
                        account: {
                            account_id: message.account.account_id,
                        },
                        role: ((_a = message.options) === null || _a === void 0 ? void 0 : _a.roles) ? (0, typeorm_2.In)((_b = message.options) === null || _b === void 0 ? void 0 : _b.roles) : null,
                    },
                },
            });
            if ((_c = message.options) === null || _c === void 0 ? void 0 : _c.roles.includes(users_enums_1.UserRole.OWNER)) {
                const god_users = yield this.authService.getGodUsers();
                users = [...users, ...god_users];
            }
            if (message.unique && (yield this.query.findOne(this.repository, { where: { unique: message.unique } }))) {
                this.logger.log(`[${domain}] Skipping as message is already sent`);
                return;
            }
            const notification = yield _super.create.call(this, {
                account: message.account,
                users: users,
                subject: message.subject,
                markdown: message.markdown,
                unique: message.unique,
            });
            yield this.beaconPushService.create({
                methods: {
                    push: true,
                },
                communication: {
                    event: `account_${message.account.account_id}_beacon_notification`,
                },
            });
            return notification;
        });
    }
};
exports.BeaconNotificationService = BeaconNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(1, (0, typeorm_1.InjectRepository)(E)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => push_service_1.BeaconPushService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [Query_1.Query,
        typeorm_2.Repository,
        utils_1.Logger,
        push_service_1.BeaconPushService,
        auth_service_1.AuthService,
        users_service_1.UsersService])
], BeaconNotificationService);
//# sourceMappingURL=notification.service.js.map