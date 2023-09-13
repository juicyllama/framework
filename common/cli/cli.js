#!/usr/bin/env ts-node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = __importDefault(require("os"));
var yargs_1 = __importDefault(require("yargs/yargs"));
var ipt_1 = __importDefault(require("ipt"));
var package_json_1 = require("./package.json");
var logging_1 = require("./helpers/logging");
var scripts_enums_1 = require("./scripts.enums");
var install_1 = require("./scripts/install");
var start_1 = require("./scripts/start");
var sep = os_1.default.EOL;
function getMainArgs() {
    var i = -1;
    var result = [];
    var mainArgs = process.argv.slice(2);
    while (++i < mainArgs.length) {
        if (mainArgs[i] === "--")
            break;
        result.push(mainArgs[i]);
    }
    return result;
}
function runScript(script) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, logging_1.cli_log)("Running script ".concat(script));
                    _a = script;
                    switch (_a) {
                        case scripts_enums_1.Script.install: return [3 /*break*/, 1];
                        case scripts_enums_1.Script.start: return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, (0, install_1.install)()];
                case 2:
                    _b.sent();
                    (0, logging_1.cli_log)("Install complete!");
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, (0, start_1.start)()];
                case 4:
                    _b.sent();
                    (0, logging_1.cli_log)("Development started!");
                    return [3 /*break*/, 6];
                case 5:
                    (0, logging_1.cli_error)("Script ".concat(script, " not implemented"));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var argv;
        var _this = this;
        return __generator(this, function (_a) {
            (0, logging_1.cli_log)("JL Cli v".concat(package_json_1.version));
            argv = (0, yargs_1.default)(getMainArgs()).argv;
            if (argv._.length > 0) {
                runScript(scripts_enums_1.Script[argv._[0]]);
            }
            else {
                (0, ipt_1.default)(Object.values(scripts_enums_1.Script), {
                    message: "Select a script to run",
                    separator: sep,
                })
                    .then(function (keys) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, runScript(keys[0])];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .catch(function () {
                    (0, logging_1.cli_error)("Error building interactive interface");
                });
            }
            return [2 /*return*/];
        });
    });
}
run();
