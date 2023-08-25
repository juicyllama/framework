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
exports.loadEnvVariables = void 0;
const utils_1 = require("@juicyllama/utils");
function loadEnvVariables(SECRET_MANAGER_NAME, envPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = new utils_1.Logger();
        try {
            if (!utils_1.Modules.isInstalled('@juicyllama/app-aws')) {
                new Error('[loadEnvVariables] AWS Module not installed');
            }
            const { getSecret } = yield Promise.resolve().then(() => __importStar(require('@juicyllama/app-aws')));
            const secrets = yield getSecret(SECRET_MANAGER_NAME);
            if (!secrets) {
                logger.error(`[loadEnvVariables] No secrets found for ${SECRET_MANAGER_NAME}`);
            }
            for (const [key, value] of Object.entries(secrets)) {
                process.env[key] = value;
                utils_1.Env.setEnvValue({
                    key: key,
                    value: value,
                    envPath: envPath,
                });
                logger.debug(`[loadEnvVariables] Added key ${key} to process.env`);
            }
            return secrets;
        }
        catch (e) {
            logger.error(`[loadEnvVariables] ${e.message}`, e.stack);
        }
    });
}
exports.loadEnvVariables = loadEnvVariables;
//# sourceMappingURL=aws.secrets.js.map