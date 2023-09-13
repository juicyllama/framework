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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDoppler = void 0;
var files_1 = require("./files");
var logging_1 = require("./logging");
var child_process_1 = require("child_process");
function login() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            (0, child_process_1.exec)("doppler login", function (error, stdout, stderr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (error) {
                        (0, logging_1.cli_error)("error: ".concat(stderr));
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
                });
            }); });
            (0, child_process_1.exec)("doppler setup --no-interactive", function (error, stdout, stderr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (error) {
                        (0, logging_1.cli_error)("error: ".concat(stderr));
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
                });
            }); });
            return [2 /*return*/, true];
        });
    });
}
function sync() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            (0, child_process_1.exec)("doppler secrets --json > secrets.json", function (error, stdout, stderr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (error) {
                        (0, logging_1.cli_error)("error: ".concat(stderr));
                    }
                    return [2 /*return*/];
                });
            }); });
            (0, child_process_1.exec)("jq -r 'to_entries|map(\"\\(.key)=\\(.value.computed|tostring)\")|.[]' secrets.json > .env", function (error, stdout, stderr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (error) {
                        (0, logging_1.cli_error)("error: ".concat(stderr));
                    }
                    return [2 /*return*/];
                });
            }); });
            (0, child_process_1.exec)("rm -rf secrets.json", function (error, stdout, stderr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (error) {
                        (0, logging_1.cli_error)("error: ".concat(stderr));
                    }
                    return [2 /*return*/];
                });
            }); });
            (0, child_process_1.exec)("export $(grep -v '^#' .env)", function (error, stdout, stderr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (error) {
                        (0, logging_1.cli_error)("error: ".concat(stderr));
                    }
                    return [2 /*return*/];
                });
            }); });
            return [2 /*return*/];
        });
    });
}
function setupDoppler() {
    return __awaiter(this, void 0, void 0, function () {
        var created, authed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    created = false;
                    authed = true;
                    if (!!(0, files_1.fileExists)(files_1.currentPath + '.env')) return [3 /*break*/, 2];
                    (0, logging_1.cli_log)("Login to Doppler for fetching .env secrets");
                    return [4 /*yield*/, login()];
                case 1:
                    authed = _a.sent();
                    created = true;
                    _a.label = 2;
                case 2:
                    if (!authed) {
                        (0, logging_1.cli_error)("Doppler authentication failed");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, sync()];
                case 3:
                    _a.sent();
                    if (created) {
                        (0, logging_1.cli_log)('Secrets Installed');
                    }
                    else {
                        (0, logging_1.cli_log)('Secrets Updated');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.setupDoppler = setupDoppler;
