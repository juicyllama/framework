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
var SettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const settings_entity_1 = require("./settings.entity");
const utils_1 = require("@juicyllama/utils");
const Query_1 = require("../../utils/typeorm/Query");
const cache_key = 'utils::settings';
let SettingsService = exports.SettingsService = SettingsService_1 = class SettingsService {
    constructor(query, repository, cacheManager, logger) {
        this.query = query;
        this.repository = repository;
        this.cacheManager = cacheManager;
        this.logger = logger;
    }
    create(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!SettingsService_1.validate(value)) {
                this.logger.error('Value must be an object');
                throw new Error('Value must be an object');
            }
            let setting = yield this.findOne(key);
            if (setting) {
                return yield this.update(key, value);
            }
            setting = yield this.query.create(this.repository, {
                key: key,
                value: value,
            });
            yield this.cacheManager.set(utils_1.JLCache.cacheKey(cache_key, key), setting, utils_1.CachePeriod.MONTH);
            return setting;
        });
    }
    findOne(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let setting = yield this.cacheManager.get(utils_1.JLCache.cacheKey(cache_key, key));
            if (setting)
                return setting;
            setting = yield this.repository.findOne({
                where: { key: key },
            });
            if (setting) {
                yield this.cacheManager.set(utils_1.JLCache.cacheKey(cache_key, key), setting, utils_1.CachePeriod.MONTH);
            }
            return setting;
        });
    }
    findAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.findAll(this.repository, options);
        });
    }
    findValue(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.findOne(key);
            if (result && result.value) {
                return result.value;
            }
        });
    }
    update(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!SettingsService_1.validate(value)) {
                this.logger.error('Value must be an object');
                throw new Error('Value must be an object');
            }
            const setting = yield this.findOne(key);
            if (!setting) {
                return yield this.create(key, value);
            }
            yield this.repository.update(setting.id, {
                value: value,
            });
            setting.value = value;
            yield this.cacheManager.set(utils_1.JLCache.cacheKey(cache_key, key), setting, utils_1.CachePeriod.MONTH);
            return setting;
        });
    }
    purge(setting) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cacheManager.del(utils_1.JLCache.cacheKey(cache_key, setting.key));
            return yield this.query.purge(this.repository, setting);
        });
    }
    cronCheck(domain, time) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utils_1.Env.IsProd()) {
                return true;
            }
            const setting = yield this.findValue(domain);
            if (setting && setting.running === true && new Date(setting.next_run_override) > new Date()) {
                this.logger.warn(`[${domain}] Previous job still running`);
                return false;
            }
            const next_run_override = new Date();
            next_run_override.setMinutes(next_run_override.getMinutes() + time);
            yield this.update(domain, {
                running: true,
                next_run_override: next_run_override,
            });
            return true;
        });
    }
    cronEnd(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update(domain, {
                running: false,
                next_run_override: new Date(),
            });
        });
    }
    static validate(value) {
        return value instanceof Object;
    }
};
exports.SettingsService = SettingsService = SettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(1, (0, typeorm_1.InjectRepository)(settings_entity_1.Setting)),
    __param(2, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __param(3, (0, common_1.Inject)(utils_1.Logger)),
    __metadata("design:paramtypes", [Query_1.Query,
        typeorm_2.Repository, Object, utils_1.Logger])
], SettingsService);
//# sourceMappingURL=settings.service.js.map