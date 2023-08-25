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
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
const Query_1 = require("../utils/typeorm/Query");
const typeorm_1 = require("typeorm");
const utils_1 = require("@juicyllama/utils");
let BaseService = exports.BaseService = class BaseService {
    constructor(query, repository, options) {
        this.query = query;
        this.repository = repository;
        this.options = options;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.query.create(this.repository, data);
            yield this.cacheRecord(result);
            yield this.sendBeacon({ action: 'CREATE', data: result });
            return result;
        });
    }
    createMany(qty, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (let i = 0; i < qty; i++) {
                const result = yield this.query.create(this.repository, data);
                results.push(result);
                yield this.cacheRecord(result);
                yield this.sendBeacon({ action: 'CREATE', data: result });
            }
            return results;
        });
    }
    bulkInsert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.bulkInsert(this.repository, data);
        });
    }
    findAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.findAll(this.repository, options);
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.cacheFindOne(options);
            if (result)
                return result;
            result = yield this.query.findOne(this.repository, options);
            if (result)
                yield this.cacheRecord(result);
            return result;
        });
    }
    findById(id, relations) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.cacheFindById(id);
            if (result)
                return result;
            result = yield this.query.findOneById(this.repository, id, relations);
            if (result)
                yield this.cacheRecord(result);
            return result;
        });
    }
    count(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.count(this.repository, options);
        });
    }
    sum(metric, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.sum(this.repository, metric, options);
        });
    }
    avg(metric, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.avg(this.repository, metric, options);
        });
    }
    charts(field, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.charts(this.repository, field, options);
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.query.update(this.repository, data);
            yield this.cacheRecord(result);
            yield this.sendBeacon({ action: 'UPDATE', data: result });
            return result;
        });
    }
    remove(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.query.remove(this.repository, record);
            yield this.cacheDelete(record);
            yield this.sendBeacon({ action: 'DELETE', data: result });
            return result;
        });
    }
    purge(record) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query.purge(this.repository, record);
            yield this.cacheDelete(record);
            yield this.sendBeacon({ action: 'DELETE', data: record });
        });
    }
    raw(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.raw(this.repository, sql);
        });
    }
    sendBeacon(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.beacon) {
                yield ((_b = this.options) === null || _b === void 0 ? void 0 : _b.beacon.sendPush(this.query.getEventName(this.repository, options.data), options));
            }
        });
    }
    getCacheKey(value) {
        return utils_1.JLCache.cacheKey(`database`, this.query.getTableName(this.repository), {
            [this.getCacheField()]: value,
        });
    }
    getCacheTTL() {
        return this.options.cache.ttl || utils_1.CachePeriod.DAY;
    }
    getCacheField() {
        return this.options.cache.field || this.query.getPrimaryKey(this.repository);
    }
    cacheRecord(record) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.cache) === null || _b === void 0 ? void 0 : _b.cacheManager) && this.getCacheKey(record[this.getCacheField()])) {
                yield this.options.cache.cacheManager.set(this.getCacheKey(record[this.getCacheField()]), record, this.getCacheTTL());
            }
        });
    }
    cacheFindOne(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.cache) === null || _b === void 0 ? void 0 : _b.cacheManager) && (options === null || options === void 0 ? void 0 : options.where[this.getCacheField()]) !== undefined) {
                return yield this.options.cache.cacheManager.get(this.getCacheKey(options === null || options === void 0 ? void 0 : options.where[this.getCacheField()]));
            }
            return;
        });
    }
    cacheFindById(id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.cache) === null || _b === void 0 ? void 0 : _b.cacheManager) && this.getCacheField() === this.query.getPrimaryKey(this.repository)) {
                return yield this.options.cache.cacheManager.get(this.getCacheKey(id));
            }
            return;
        });
    }
    cacheDelete(record) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.cache) === null || _b === void 0 ? void 0 : _b.cacheManager) && this.getCacheKey(record[this.getCacheField()])) {
                yield this.options.cache.cacheManager.del(this.getCacheKey(record[this.getCacheField()]));
            }
        });
    }
};
exports.BaseService = BaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Query_1.Query,
        typeorm_1.Repository, Object])
], BaseService);
//# sourceMappingURL=baseService.js.map