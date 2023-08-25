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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const storage_enums_1 = require("./storage.enums");
const core_1 = require("@nestjs/core");
let StorageService = exports.StorageService = class StorageService {
    constructor(logger, cacheManager, lazyModuleLoader) {
        this.logger = logger;
        this.cacheManager = cacheManager;
        this.lazyModuleLoader = lazyModuleLoader;
    }
    write(location, permissions, format = storage_enums_1.StorageFileFormat.BLOB, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'common::storage::write';
            if (utils_1.Enviroment.test === utils_1.Enviroment[process.env.NODE_ENV]) {
                this.logger.verbose(`[${domain}] Skipping as testing`);
                return;
            }
            this.logger.debug(`[${domain}] Create File: ${location}`);
            if (format === storage_enums_1.StorageFileFormat.Express_Multer_File) {
                file = file;
                file = file.buffer;
                format = storage_enums_1.StorageFileFormat.BLOB;
            }
            const cache_key = utils_1.JLCache.cacheKey(domain, { location: location, permissions: permissions });
            yield this.cacheManager.del(cache_key);
            yield this.cacheManager.set(cache_key, file, utils_1.CachePeriod.MONTH);
            let service;
            if (utils_1.Modules.isInstalled('@juicyllama/app-aws')) {
                const { AwsS3Module, AwsS3Service } = yield Promise.resolve().then(() => __importStar(require('@juicyllama/app-aws')));
                try {
                    const awsS3Module = yield this.lazyModuleLoader.load(() => AwsS3Module);
                    service = awsS3Module.get(AwsS3Service);
                    return yield service.create(location, permissions, format, file);
                }
                catch (e) {
                    this.logger.error(`[${domain}] ${e.message}`, e);
                }
            }
            if (!service) {
                this.logger.error(`No storage app installed, options are: @juicyllama/app-aws`);
                return false;
            }
        });
    }
    list(location, permissions) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'common::storage::list';
            this.logger.debug(`[${domain}] list`);
            let service;
            if (utils_1.Modules.isInstalled('@juicyllama/app-aws')) {
                const { AwsS3Module, AwsS3Service } = yield Promise.resolve().then(() => __importStar(require('@juicyllama/app-aws')));
                const awsS3Module = yield this.lazyModuleLoader.load(() => AwsS3Module);
                service = awsS3Module.get(AwsS3Service);
                return yield service.findAll(location, permissions);
            }
            if (!service) {
                this.logger.error(`[${domain}] No storage app installed`);
                return false;
            }
        });
    }
    read(location, permissions, format = storage_enums_1.StorageFileFormat.BLOB) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'common::storage::read';
            this.logger.debug(`[${domain}] Read`);
            const cache_key = utils_1.JLCache.cacheKey(domain, { location: location, permissions: permissions });
            let file = yield this.cacheManager.get(cache_key);
            if (file) {
                this.logger.debug(`[${domain}] Returned from cache: ${location}`);
                return file;
            }
            let service;
            if (utils_1.Modules.isInstalled('@juicyllama/app-aws')) {
                const { AwsS3Module, AwsS3Service } = yield Promise.resolve().then(() => __importStar(require('@juicyllama/app-aws')));
                const awsS3Module = yield this.lazyModuleLoader.load(() => AwsS3Module);
                service = awsS3Module.get(AwsS3Service);
                file = yield service.findOne(location, permissions, format);
            }
            if (!service) {
                this.logger.error(`[${domain}] No storage app installed`);
                return false;
            }
            if (!file) {
                this.logger.error(`[${domain}] No file found: ${location}`);
                return false;
            }
            yield this.cacheManager.set(cache_key, file, utils_1.CachePeriod.MONTH);
            return file;
        });
    }
    del(location, permissions) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'common::storage::del';
            this.logger.debug(`[${domain}] Delete file: ${location}`);
            const cache_key = utils_1.JLCache.cacheKey(domain, { location: location, permissions: permissions });
            yield this.cacheManager.del(cache_key);
            let service;
            if (utils_1.Modules.isInstalled('@juicyllama/app-aws')) {
                const { AwsS3Module, AwsS3Service } = yield Promise.resolve().then(() => __importStar(require('@juicyllama/app-aws')));
                const awsS3Module = yield this.lazyModuleLoader.load(() => AwsS3Module);
                service = awsS3Module.get(AwsS3Service);
                yield service.remove(location, permissions);
                return true;
            }
            if (!service) {
                this.logger.error(`[${domain}] No storage app installed`);
                return false;
            }
        });
    }
};
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(utils_1.Logger)),
    __param(1, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [utils_1.Logger, Object, core_1.LazyModuleLoader])
], StorageService);
//# sourceMappingURL=storage.service.js.map