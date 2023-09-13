"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToFile = exports.fileExists = exports.currentPath = exports.File = void 0;
var child_process_1 = require("child_process");
var logging_1 = require("./logging");
var fs_1 = __importDefault(require("fs"));
var File;
(function (File) {
    File["HOSTS"] = "/etc/hosts";
})(File || (exports.File = File = {}));
exports.currentPath = process.cwd();
function fileExists(location) {
    return fs_1.default.existsSync(location);
}
exports.fileExists = fileExists;
function writeToFile(file, content) {
    (0, child_process_1.exec)("\techo ".concat(content, " | sudo tee -a ").concat(file, " >/dev/null"), function (error, stdout, stderr) {
        if (error) {
            (0, logging_1.cli_error)("error: ".concat(error.message));
        }
        if (stderr) {
            (0, logging_1.cli_error)("stderr: ".concat(stderr));
        }
        return;
    });
}
exports.writeToFile = writeToFile;
