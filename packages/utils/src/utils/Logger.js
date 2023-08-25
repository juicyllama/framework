"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const Modules_1 = require("./Modules");
const Env_1 = require("./Env");
class Logger {
    data(key, value) {
        if (Env_1.Env.IsNotTest()) {
            let Bugsnag;
            if (Modules_1.Modules.isInstalled('@bugsnag/js')) {
                Bugsnag = require('@bugsnag/js');
                Bugsnag.addMetadata(key, value);
            }
        }
        this.verbose(`[${key}]=>${JSON.stringify(value)}`);
    }
    error(message, ...optionalParams) {
        let colored = `\x1b[31m`;
        if (optionalParams) {
            message = this.processParams(message, optionalParams);
        }
        colored += `${message}\x1b[0m`;
        if (Env_1.Env.IsNotTest() || Number(process.env.TEST_LOGGING) <= 5) {
            console.error(colored);
        }
        if (Env_1.Env.IsNotTest()) {
            switch (message) {
                case 'Unexpected token o in JSON at position 1':
                case 'Unexpected token o in JSON at position 1SyntaxError: Unexpected token o in JSON at position 1':
                    break;
                default:
                    if (Modules_1.Modules.isInstalled('@bugsnag/js')) {
                        const Bugsnag = require('@bugsnag/js');
                        Bugsnag.notify(new Error(message));
                    }
            }
        }
    }
    warn(message, ...optionalParams) {
        let colored = `\x1b[33m`;
        if (optionalParams) {
            message = this.processParams(message, optionalParams);
        }
        colored += `${message}\x1b[0m`;
        if (Env_1.Env.IsNotTest() || Number(process.env.TEST_LOGGING) <= 4) {
            console.warn(colored);
        }
    }
    log(message, ...optionalParams) {
        let colored = `\x1b[32m`;
        if (optionalParams) {
            message = this.processParams(message, optionalParams);
        }
        colored += `${message}\x1b[0m`;
        if (Env_1.Env.IsNotTest() || Number(process.env.TEST_LOGGING) <= 3) {
            console.log(colored);
        }
    }
    debug(message, ...optionalParams) {
        let colored = `\x1b[35m`;
        if (optionalParams) {
            message = this.processParams(message, optionalParams);
        }
        colored += `${message}\x1b[0m`;
        if (Env_1.Env.IsNotTest() || Number(process.env.TEST_LOGGING) <= 2) {
            console.debug(colored);
        }
    }
    verbose(message, ...optionalParams) {
        let colored = `\x1b[36m`;
        if (optionalParams) {
            message = this.processParams(message, optionalParams);
        }
        colored += `${message}\x1b[0m`;
        if (Number(process.env.TEST_LOGGING) <= 1) {
            console.debug(colored);
        }
    }
    table(data) {
        if (Env_1.Env.IsDev()) {
            console.table(data);
        }
    }
    processParams(message, optionalParams) {
        try {
            for (const param of optionalParams) {
                switch (typeof param) {
                    case 'undefined':
                        break;
                    case 'object':
                        try {
                            message += ` ${JSON.stringify(param)}`;
                        }
                        catch (e) {
                            message += ` **Logger Error** Failed to read JSON object`;
                        }
                        break;
                    case 'string':
                    case 'boolean':
                        message += param;
                        break;
                    default:
                        this.error(`typeof param of optionalParams ${typeof param} not handled`);
                }
            }
        }
        catch (e) {
            this.error(e.message);
            if (Modules_1.Modules.isInstalled('@bugsnag/js')) {
                const Bugsnag = require('@bugsnag/js');
                Bugsnag.notify(new Error(e));
            }
        }
        return message;
    }
}
exports.Logger = Logger;
