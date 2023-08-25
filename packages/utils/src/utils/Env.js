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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env = void 0;
const env_1 = require("../enums/env");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
class Env {
    static get() {
        return env_1.Enviroment[process.env.NODE_ENV];
    }
    static IsProd() {
        return this.get() === env_1.Enviroment.production;
    }
    static IsDev() {
        return this.get() === env_1.Enviroment.development;
    }
    static IsTest() {
        return this.get() === env_1.Enviroment.test;
    }
    static IsNotTest() {
        return this.get() !== env_1.Enviroment.test;
    }
    static IsNotProd() {
        return this.get() !== env_1.Enviroment.production;
    }
    static IsSandbox() {
        return this.get() === env_1.Enviroment.sandbox;
    }
    static useCache() {
        return this.IsNotTest();
    }
    static readEnvVars(options) {
        if (!options.envPath)
            options.envPath = './';
        if (!options.fileName)
            options.fileName = '.env';
        return fs.readFileSync(path.resolve(options.envPath, options.fileName), 'utf-8').split(os.EOL);
    }
    static getEnvValue(options) {
        if (!options.envPath)
            options.envPath = './';
        if (!options.fileName)
            options.fileName = '.env';
        const matchedLine = Env.readEnvVars({ envPath: options.envPath, fileName: options.fileName }).find((line) => line.split('=')[0] === options.key);
        const result = matchedLine !== undefined ? matchedLine.split('=')[1] : null;
        return result.replace(/"/g, '');
    }
    static setEnvValue(options) {
        if (!options.envPath)
            options.envPath = './';
        if (!options.fileName)
            options.fileName = '.env';
        const envVars = Env.readEnvVars({ envPath: options.envPath, fileName: options.fileName });
        const targetLine = envVars.find((line) => line.split('=')[0] === options.key);
        if (targetLine !== undefined) {
            const targetLineIndex = envVars.indexOf(targetLine);
            envVars.splice(targetLineIndex, 1, `${options.key}="${options.value}"`);
        }
        else {
            envVars.push(`${options.key}="${options.value}"`);
        }
        fs.writeFileSync(path.resolve(options.envPath, options.fileName), envVars.join(os.EOL));
    }
    static setEnv(options) {
        for (const key of Object.keys(options.values)) {
            Env.setEnvValue({
                key: key,
                value: options.values[key],
                envPath: options.envPath,
                fileName: options.fileName,
            });
        }
    }
}
exports.Env = Env;
