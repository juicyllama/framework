"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const utils_1 = require("@juicyllama/utils");
let TypeOrmFilter = exports.TypeOrmFilter = class TypeOrmFilter {
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        const message = exception.message;
        const code = exception.code;
        const details = exception.sql;
        const logger = new utils_1.Logger();
        switch (code) {
            default:
                logger.debug(`[${code}] ${message} (${details})`, exception);
        }
        response.status(500).json({
            status: 500,
            error: [utils_1.Enviroment.development].includes(utils_1.Enviroment[process.env.NODE_ENV])
                ? `[${code}] ${message} (${details})`
                : 'Database Error',
        });
    }
};
exports.TypeOrmFilter = TypeOrmFilter = __decorate([
    (0, common_1.Catch)(typeorm_1.TypeORMError)
], TypeOrmFilter);
//# sourceMappingURL=TypeOrmFilter.js.map