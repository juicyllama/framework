"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli_error = exports.cli_log = void 0;
var simple_output_1 = __importDefault(require("simple-output"));
function cli_log(message) {
    simple_output_1.default.node("\uD83E\uDD99 \u001B[1;33m".concat(message, "\u001B[0m"));
}
exports.cli_log = cli_log;
function cli_error(message) {
    simple_output_1.default.node("\uD83E\uDD99 \u001B[0;31m".concat(message, "\u001B[0m"));
}
exports.cli_error = cli_error;
