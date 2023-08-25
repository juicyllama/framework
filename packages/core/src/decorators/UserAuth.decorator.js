"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuth = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../modules/auth/guards/jwt-auth.guard");
function UserAuth(options) {
    const decorators = [(0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    if (!(options === null || options === void 0 ? void 0 : options.skipAccountId)) {
        decorators.push((0, swagger_1.ApiHeader)({
            name: 'account-id',
            description: 'The account you are acting for',
            required: true,
            example: 1,
        }));
    }
    decorators.push((0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Authentication problem, check access token or account permissions',
    }));
    decorators.push((0, swagger_1.ApiForbiddenResponse)({
        description: 'User role does not have sufficient permissions to access this endpoint',
    }));
    decorators.push((0, swagger_1.ApiNotFoundResponse)({ description: 'Not Found' }));
    return (0, common_1.applyDecorators)(...decorators);
}
exports.UserAuth = UserAuth;
//# sourceMappingURL=UserAuth.decorator.js.map