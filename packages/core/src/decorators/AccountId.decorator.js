"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountId = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const lodash_1 = require("lodash");
exports.AccountId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const account_id = request.headers['account-id'];
    if (!account_id || (0, lodash_1.isNil)(account_id)) {
        const logger = new utils_1.Logger();
        logger.warn('[@AccountId Decorator] Missing required header value: account-id', request);
        console.table(request.headers);
        throw new common_1.BadRequestException('Missing required header value: account-id');
    }
    return Number(account_id);
});
//# sourceMappingURL=AccountId.decorator.js.map