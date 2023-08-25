"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageFileFormat = exports.StorageFileType = void 0;
var StorageFileType;
(function (StorageFileType) {
    StorageFileType["PUBLIC"] = "PUBLIC";
    StorageFileType["PRIVATE"] = "PRIVATE";
})(StorageFileType || (exports.StorageFileType = StorageFileType = {}));
var StorageFileFormat;
(function (StorageFileFormat) {
    StorageFileFormat["BLOB"] = "BLOB";
    StorageFileFormat["JSON"] = "JSON";
    StorageFileFormat["CSV"] = "CSV";
    StorageFileFormat["Express_Multer_File"] = "Express_Multer_File";
})(StorageFileFormat || (exports.StorageFileFormat = StorageFileFormat = {}));
//# sourceMappingURL=storage.enums.js.map