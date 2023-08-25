"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JLCache = void 0;
const env_1 = require("../enums/env");
class JLCache {
    static cacheKey(domain, ...optionalParams) {
        if (!optionalParams) {
            return domain;
        }
        let key = domain;
        for (const param of optionalParams) {
            switch (typeof param) {
                case 'undefined':
                    break;
                case 'object':
                    for (const [k, v] of Object.entries(param)) {
                        key += `::${k}:${v}`;
                    }
                    break;
                case 'string':
                case 'boolean':
                    key += `::${param}`;
                    break;
            }
        }
        return key;
    }
    static cacheKeyFromRoute(route, query) {
        if (query) {
            if (query.from) {
                query.from = new Date(query.from);
                query.from = `${query.from.getFullYear()}${query.from.getMonth()}${query.from.getDate()}`;
            }
            if (query.to) {
                query.to = new Date(query.to);
                query.to = `${query.to.getFullYear()}${query.to.getMonth()}${query.to.getDate()}`;
            }
            if (query.date) {
                query.date = new Date(query.date);
                query.date = `${query.date.getFullYear()}${query.date.getMonth()}${query.date.getDate()}`;
            }
            const queryString = Object.keys(query)
                .map((key) => key + '=' + query[key])
                .join('&');
            return `route::${env_1.Enviroment[process.env.NODE_ENV]}${route}/${queryString}`;
        }
        return `route::${env_1.Enviroment[process.env.NODE_ENV]}${route}`;
    }
}
exports.JLCache = JLCache;
