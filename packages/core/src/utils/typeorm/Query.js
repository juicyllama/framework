"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.Query = void 0;
const typeorm_1 = require("typeorm");
const TypeOrm_1 = require("./TypeOrm");
const lodash_1 = __importStar(require("lodash"));
const utils_1 = require("@juicyllama/utils");
const logger = new utils_1.Logger();
class Query {
    raw(repository, sql) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.Env.IsNotProd()) {
                logger.debug(`[QUERY][RAW][${repository.metadata.tableName}] ${sql}`);
            }
            return yield repository.query(sql);
        });
    }
    create(repository, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.Env.IsNotProd()) {
                logger.debug(`[QUERY][CREATE][${repository.metadata.tableName}]`, data);
            }
            try {
                const record = repository.create(data);
                return yield repository.save(record);
            }
            catch (e) {
                return yield this.handleCreateError(e, repository, data);
            }
        });
    }
    bulkInsert(repository, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const inserts = [];
            for (const row of data) {
                const values = Object.values(row)
                    .map((v) => `'${v.replace("'", "\\'")}'`)
                    .join(', ');
                inserts.push(`(${values})`);
            }
            return this.raw(repository, `INSERT INTO ${repository.metadata.tableName} (${Object.keys(data[0]).join(',')}) VALUES ` +
                inserts.join(', '));
        });
    }
    findOneById(repository, id, relations) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            where[this.getPrimaryKey(repository)] = id;
            return this.findOne(repository, {
                where: where,
                relations: (relations === null || relations === void 0 ? void 0 : relations.length) ? relations : this.getRelations(repository),
            });
        });
    }
    findOneByWhere(repository, where, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = TypeOrm_1.TypeOrm.findOneOptionsWrapper(repository, options);
            return this.findOne(repository, Object.assign(Object.assign({}, options), { where: where }));
        });
    }
    findOne(repository, options) {
        if (utils_1.Env.IsNotProd()) {
            logger.debug(`[QUERY][FIND][ONE][${repository.metadata.tableName}]`, { options: options });
        }
        options = TypeOrm_1.TypeOrm.findOneOptionsWrapper(repository, options);
        return repository.findOne(options);
    }
    findAll(repository, options) {
        if (utils_1.Env.IsNotProd()) {
            logger.debug(`[QUERY][FIND][MANY][${repository.metadata.tableName}]`, { options: options });
        }
        options = TypeOrm_1.TypeOrm.findAllOptionsWrapper(repository, options);
        return repository.find(options);
    }
    update(repository, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.Env.IsNotProd()) {
                logger.debug(`[QUERY][UPDATE][${repository.metadata.tableName}]`, data);
            }
            if (!data[this.getPrimaryKey(repository)]) {
                throw new Error(`Primary key ${this.getPrimaryKey(repository)} missing from update to ${repository.metadata.tableName}`);
            }
            try {
                yield repository.update(data[this.getPrimaryKey(repository)], data);
                return yield this.findOneById(repository, data[this.getPrimaryKey(repository)]);
            }
            catch (e) {
                return yield this.handleUpdateError(e, repository, data);
            }
        });
    }
    count(repository, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.Env.IsNotProd()) {
                logger.debug(`[QUERY][COUNT][${repository.metadata.tableName}]`, { options: options });
            }
            options = TypeOrm_1.TypeOrm.findAllOptionsWrapper(repository, options);
            return yield repository.count(options);
        });
    }
    sum(repository, metric, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.Env.IsNotProd()) {
                logger.debug(`[QUERY][SUM][${repository.metadata.tableName}]`, { metric: metric, options: options });
            }
            options = TypeOrm_1.TypeOrm.findAllOptionsWrapper(repository, options);
            const result = yield repository
                .createQueryBuilder()
                .where(options.where)
                .select(`SUM(${metric}) as sum`)
                .execute();
            return Number(Number(result[0].sum).toFixed(2));
        });
    }
    avg(repository, metric, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.Env.IsNotProd()) {
                logger.debug(`[QUERY][AVG][${repository.metadata.tableName}]`, { metric: metric, options: options });
            }
            options = TypeOrm_1.TypeOrm.findAllOptionsWrapper(repository, options);
            const result = yield repository
                .createQueryBuilder()
                .where(options.where)
                .select(`AVG(${metric}) as average`)
                .execute();
            return Number(Number(result[0].average).toFixed(2));
        });
    }
    charts(repository, field, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.Env.IsNotProd()) {
                logger.debug(`[QUERY][CHARTS][${repository.metadata.tableName}]`, { field, options: options });
            }
            options = TypeOrm_1.TypeOrm.findAllOptionsWrapper(repository, options);
            let queryBuilder = repository
                .createQueryBuilder()
                .select('COUNT(*)', 'count')
                .addSelect(field);
            if (options.period) {
                queryBuilder = queryBuilder.addSelect((0, utils_1.getMySQLTimeInterval)(options.period), 'time_interval');
            }
            queryBuilder.where(options.where);
            if (options.from) {
                queryBuilder = queryBuilder.andWhere('created_at >= :from', { from: options.from });
            }
            if (options.to) {
                queryBuilder = queryBuilder.andWhere('created_at <= :to', { to: options.to });
            }
            queryBuilder = queryBuilder.groupBy(field);
            if (options.period) {
                queryBuilder = queryBuilder.addGroupBy('time_interval');
            }
            return queryBuilder.getRawMany();
        });
    }
    remove(repository, record) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.Env.IsNotProd()) {
                logger.debug(`[QUERY][REMOVE][${repository.metadata.tableName}]`, record);
            }
            yield repository.softRemove(record);
            return record;
        });
    }
    purge(repository, record) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.Env.IsNotProd()) {
                logger.debug(`[QUERY][PURGE][${repository.metadata.tableName}]`, record);
            }
            yield repository.remove(record);
        });
    }
    getPrimaryKey(repository) {
        return repository.metadata.columns.find(column => {
            if (column.isPrimary) {
                return column;
            }
        }).propertyName;
    }
    getTableName(repository) {
        return repository.metadata.tableName;
    }
    getRelations(repository) {
        const result = {};
        const relations = repository.metadata.relations.map(column => {
            return column.propertyName;
        });
        for (const r in relations) {
            result[relations[r]] = true;
        }
        return result;
    }
    getEventName(repository, result) {
        let event = '';
        if (result['account_id']) {
            event = `account_${result['account_id']}_`;
        }
        else if (result['account']) {
            event = `account_${result['account'].account_id}_`;
        }
        else if (result['user']) {
            event = `user_${result['user_id']}_`;
        }
        else if (result['user']) {
            event = `user_${result['user'].user_id}_`;
        }
        return (event += this.getTableName(repository));
    }
    mapComparisonOperatorToTypeORMFindOperators(op, value) {
        switch (op) {
            case utils_1.ComparisonOperator.GT:
                return (0, typeorm_1.MoreThan)(value);
            case utils_1.ComparisonOperator.GTE:
                return (0, typeorm_1.MoreThanOrEqual)(value);
            case utils_1.ComparisonOperator.LT:
                return (0, typeorm_1.LessThan)(value);
            case utils_1.ComparisonOperator.LTE:
                return (0, typeorm_1.LessThanOrEqual)(value);
            case utils_1.ComparisonOperator.EQ:
                return (0, typeorm_1.Equal)(value);
            case utils_1.ComparisonOperator.NE:
                return (0, typeorm_1.Not)((0, typeorm_1.Equal)(value));
            case utils_1.ComparisonOperator.IS:
                return (0, typeorm_1.IsNull)();
            case utils_1.ComparisonOperator.NNULL:
                return (0, typeorm_1.Not)((0, typeorm_1.IsNull)());
            default:
                throw new Error('Unsupported operator ' + op);
        }
    }
    buildWhere(options) {
        var _a, _b, _c, _d, _e, _f, _g;
        const where = [];
        const whereBase = {};
        if (options.query) {
            for (const [key, value] of Object.entries(options.query)) {
                if (options.repository.metadata.columns.find(column => column.propertyName === key)) {
                    const fieldLookupWhere = lodash_1.default.castArray(value)
                        .reduce((memo, currentValue) => {
                        if (typeof currentValue !== 'string')
                            return memo;
                        const [operator, lookupValue] = splitStringByFirstColon(currentValue);
                        const opKeyName = utils_1.Enums.getKeyName(utils_1.ComparisonOperator, operator.toUpperCase()) ||
                            utils_1.Enums.getKeyName(utils_1.ComparisonOperator, utils_1.ComparisonOperator[currentValue.toUpperCase()]);
                        if (opKeyName) {
                            return [
                                ...memo,
                                this.mapComparisonOperatorToTypeORMFindOperators(utils_1.ComparisonOperator[opKeyName], lookupValue),
                            ];
                        }
                        return memo;
                    }, []);
                    whereBase[key] =
                        fieldLookupWhere.length === 1
                            ? fieldLookupWhere[0]
                            : fieldLookupWhere.length > 0
                                ? (0, typeorm_1.And)(...fieldLookupWhere)
                                : value;
                }
            }
        }
        if (options.account_id) {
            if (options.repository.metadata.relations.find(column => column.propertyName === 'account')) {
                whereBase['account'] = {
                    account_id: options.account_id,
                };
            }
            else if (options.repository.metadata.columns.find(column => column.propertyName === 'account_id')) {
                whereBase['account_id'] = options.account_id;
            }
        }
        if (options.account_ids) {
            if (options.repository.metadata.relations.find(column => column.propertyName === 'account')) {
                whereBase['account'] = {
                    account_id: (0, typeorm_1.In)(options.account_ids),
                };
            }
            else if (options.repository.metadata.columns.find(column => column.propertyName === 'account_id')) {
                whereBase['account_id'] = (0, typeorm_1.In)(options.account_ids);
            }
        }
        if (((_b = (_a = options.query) === null || _a === void 0 ? void 0 : _a.search) === null || _b === void 0 ? void 0 : _b.length) === 1 && ((_c = options.query) === null || _c === void 0 ? void 0 : _c.search[0]) === 'undefined') {
            delete options.query.search;
        }
        if (!((_d = options.query) === null || _d === void 0 ? void 0 : _d.search) || !options.search_fields) {
            return whereBase;
        }
        if (((_f = (_e = options.query) === null || _e === void 0 ? void 0 : _e.relations) === null || _f === void 0 ? void 0 : _f.length) === 1 && ((_g = options.query) === null || _g === void 0 ? void 0 : _g.relations[0]) === 'undefined') {
            delete options.query.relations;
        }
        for (const search in options.search_fields) {
            where.push(Object.assign(Object.assign({}, whereBase), { [options.search_fields[search]]: (0, typeorm_1.Like)(`%${options.query.search}%`) }));
        }
        return where;
    }
    findOneOptions(query, where) {
        var _a, _b;
        if (query.select) {
            query.select = query.select.split(',');
        }
        if (query.relations) {
            query.relations = query.relations.split(',');
        }
        const options = {
            where: where,
            relations: (_a = query.relations) !== null && _a !== void 0 ? _a : null,
            select: (_b = query.select) !== null && _b !== void 0 ? _b : null,
        };
        return (0, lodash_1.omitBy)(options, lodash_1.isNil);
    }
    findOptions(query, where, fallback_order_column) {
        var _a, _b, _c, _d, _e;
        if (query.select) {
            query.select = query.select.split(',');
        }
        if (query.relations) {
            query.relations = query.relations.split(',');
        }
        const options = {
            take: (_a = query.limit) !== null && _a !== void 0 ? _a : 20,
            skip: (_b = query.offset) !== null && _b !== void 0 ? _b : 0,
            order: query.order_by
                ? { [query.order_by]: (_c = query.order_by_type) !== null && _c !== void 0 ? _c : 'ASC' }
                : { [fallback_order_column !== null && fallback_order_column !== void 0 ? fallback_order_column : 'created_at']: 'DESC' },
            select: (_d = query.select) !== null && _d !== void 0 ? _d : null,
            relations: (_e = query.relations) !== null && _e !== void 0 ? _e : null,
            where: where,
        };
        return (0, lodash_1.omitBy)(options, lodash_1.isNil);
    }
    getUniqueKeyFields(repository) {
        var _a, _b;
        const uniques = [];
        if (repository.metadata.indices.length) {
            if ((_a = repository.metadata.indices[0]) === null || _a === void 0 ? void 0 : _a.columnNamesWithOrderingMap) {
                for (const [key] of Object.entries((_b = repository.metadata.indices[0]) === null || _b === void 0 ? void 0 : _b.columnNamesWithOrderingMap)) {
                    uniques.push(key);
                }
            }
        }
        if (uniques.length) {
            return uniques;
        }
        const unqiueKeys = repository.metadata.uniques.map(e => e.givenColumnNames[0]);
        if (unqiueKeys.length) {
            return unqiueKeys;
        }
        return [];
    }
    handleCreateError(e, repository, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new utils_1.Logger();
            if (e.message.startsWith('Duplicate entry')) {
                logger.warn(`[SQL][CREATE] Duplicate entry: ${e.message}`, {
                    repository: {
                        tableName: repository.metadata.tableName,
                    },
                    data: data,
                    error: e,
                });
                const uniqueKeyWhere = {};
                for (const key of this.getUniqueKeyFields(repository)) {
                    uniqueKeyWhere[key] = data[key];
                }
                return this.findOne(repository, { where: uniqueKeyWhere });
            }
            else {
                logger.error(`[SQL][CREATE] ${e.message}`, {
                    repository: {
                        tableName: repository.metadata.tableName,
                    },
                    data: data,
                    error: e,
                });
                return undefined;
            }
        });
    }
    handleUpdateError(e, repository, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new utils_1.Logger();
            if (e.message.startsWith('Duplicate entry')) {
                logger.warn(`[SQL][UPDATE] Duplicate entry: ${e.message}`, {
                    repository: {
                        tableName: repository.metadata.tableName,
                    },
                    data: data,
                    error: e,
                });
                const uniqueKeyWhere = {};
                for (const key of this.getUniqueKeyFields(repository)) {
                    uniqueKeyWhere[key] = data[key];
                }
                return this.findOne(repository, { where: uniqueKeyWhere });
            }
            else {
                logger.error(`[SQL][UPDATE]  ${e.message}`, {
                    repository: {
                        tableName: repository.metadata.tableName,
                    },
                    data: data,
                    error: e,
                });
                return undefined;
            }
        });
    }
}
exports.Query = Query;
function splitStringByFirstColon(inputString) {
    const indexOfFirstColon = inputString.indexOf(':');
    if (indexOfFirstColon !== -1) {
        const key = inputString.slice(0, indexOfFirstColon);
        const value = inputString.slice(indexOfFirstColon + 1);
        return [key, value];
    }
    else {
        return [inputString];
    }
}
//# sourceMappingURL=Query.js.map