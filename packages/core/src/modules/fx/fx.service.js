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
exports.FxService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fx_entity_1 = require("./fx.entity");
const utils_1 = require("@juicyllama/utils");
const Query_1 = require("../../utils/typeorm/Query");
const calc = (amount, from, to) => {
    return (amount / from) * to;
};
let FxService = exports.FxService = class FxService {
    constructor(query, repository, logger, cacheManager) {
        this.query = query;
        this.repository = repository;
        this.logger = logger;
        this.cacheManager = cacheManager;
    }
    convert(amount, from, to, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'utils::fx::service::convert';
            if (!date) {
                date = new Date();
            }
            const cache_key = utils_1.JLCache.cacheKey(domain, {
                date: utils_1.Dates.format(date, 'YYYY-MM-DD'),
            });
            let rates = yield this.cacheManager.get(cache_key);
            if (rates)
                return calc(amount, rates[from.toString()], rates[to.toString()]);
            rates = yield this.repository.findOne({
                where: {
                    date: date,
                },
            });
            if (rates) {
                yield this.cacheManager.set(cache_key, rates, utils_1.CachePeriod.WEEK);
                return calc(amount, rates[from.toString()], rates[to.toString()]);
            }
            let fxModule;
            if (utils_1.Modules.isInstalled('@juicyllama/app-apilayer')) {
                fxModule = require('@juicyllama/app-apilayer');
                const apilayerCurrencyData = new fxModule.ApilayerCurrencyData();
                const ext_rate = yield apilayerCurrencyData.getRate(utils_1.Dates.format(date, 'YYYY-MM-DD'));
                if (ext_rate && ext_rate.quotes) {
                    const create = {
                        date: date,
                    };
                    for (const quote of Object.values(utils_1.SupportedCurrencies)) {
                        create[quote] = ext_rate.quotes['USD' + quote];
                    }
                    rates = yield this.repository.create(create);
                    rates = yield this.repository.save(rates);
                    yield this.cacheManager.set(cache_key, rates, utils_1.CachePeriod.WEEK);
                    return calc(amount, rates[from.toString()], rates[to.toString()]);
                }
            }
            else {
                this.logger.error(`[${domain}] No FX App Installed, options are @juicyllama/app-apilayer`);
                throw new Error(`No FX App Installed, options are @juicyllama/app-apilayer`);
            }
            rates = yield this.repository.findOne({
                order: { date: 'DESC' },
            });
            if (rates) {
                return calc(amount, rates[from.toString()], rates[to.toString()]);
            }
            this.logger.error(`[${domain}] Error converting currency`, {
                from: from,
                to: to,
                amount: amount,
                date: date,
            });
        });
    }
};
exports.FxService = FxService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(1, (0, typeorm_1.InjectRepository)(fx_entity_1.FxRate)),
    __param(2, (0, common_1.Inject)(utils_1.Logger)),
    __param(3, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Query_1.Query,
        typeorm_2.Repository,
        utils_1.Logger, Object])
], FxService);
//# sourceMappingURL=fx.service.js.map