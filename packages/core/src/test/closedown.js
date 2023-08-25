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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCleanup = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const account_entity_1 = require("../modules/accounts/account.entity");
function testCleanup(moduleRef, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = moduleRef.get((0, typeorm_1.getRepositoryToken)(repo !== null && repo !== void 0 ? repo : account_entity_1.Account));
        yield repository.query(`SET FOREIGN_KEY_CHECKS = 0;`);
        yield repository.query(`SET GROUP_CONCAT_MAX_LEN=32768;`);
        yield repository.query(`SET @tables = NULL;`);
        yield repository.query(`SELECT GROUP_CONCAT('\`', table_name, '\`') INTO @tables FROM information_schema.tables WHERE table_schema = (SELECT DATABASE());`);
        yield repository.query(`SELECT IFNULL(@tables,'dummy') INTO @tables;`);
        yield repository.query(`SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);`);
        yield repository.query(`PREPARE stmt FROM @tables;`);
        yield repository.query(`EXECUTE stmt;`);
        yield repository.query(`DEALLOCATE PREPARE stmt;`);
        yield repository.query(`SET FOREIGN_KEY_CHECKS = 1;`);
        yield moduleRef.close();
    });
}
exports.testCleanup = testCleanup;
//# sourceMappingURL=closedown.js.map