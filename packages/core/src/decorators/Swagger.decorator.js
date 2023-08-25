"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerPropertyDecorator = exports.SwaggerPropertyReference = exports.SwaggerPropertyType = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var SwaggerPropertyType;
(function (SwaggerPropertyType) {
    SwaggerPropertyType[SwaggerPropertyType["STRING"] = 0] = "STRING";
    SwaggerPropertyType[SwaggerPropertyType["NUMBER"] = 1] = "NUMBER";
    SwaggerPropertyType[SwaggerPropertyType["BOOLEAN"] = 2] = "BOOLEAN";
    SwaggerPropertyType[SwaggerPropertyType["DATE"] = 3] = "DATE";
    SwaggerPropertyType[SwaggerPropertyType["ARRAY"] = 4] = "ARRAY";
    SwaggerPropertyType[SwaggerPropertyType["OBJECT"] = 5] = "OBJECT";
    SwaggerPropertyType[SwaggerPropertyType["ENUM"] = 6] = "ENUM";
    SwaggerPropertyType[SwaggerPropertyType["EMAIL"] = 7] = "EMAIL";
})(SwaggerPropertyType || (exports.SwaggerPropertyType = SwaggerPropertyType = {}));
var SwaggerPropertyReference;
(function (SwaggerPropertyReference) {
    SwaggerPropertyReference["ACCOUNT"] = "ACCOUNT";
    SwaggerPropertyReference["ACCOUNTS"] = "ACCOUNTS";
    SwaggerPropertyReference["CONTACTS"] = "CONTACTS";
    SwaggerPropertyReference["USER"] = "USER";
    SwaggerPropertyReference["USERS"] = "USERS";
})(SwaggerPropertyReference || (exports.SwaggerPropertyReference = SwaggerPropertyReference = {}));
function SwaggerPropertyDecorator(options) {
    const decorators = [];
    if (options.ref && !options.hidden) {
        switch (options.ref) {
            case SwaggerPropertyReference.ACCOUNT:
                decorators.push((0, swagger_1.ApiProperty)({
                    description: `The account this records relates to, see <a href="/#tag/Account">Account</a>`,
                }));
                decorators.push((0, class_validator_1.IsObject)());
                break;
            case SwaggerPropertyReference.ACCOUNTS:
                decorators.push((0, swagger_1.ApiProperty)({
                    description: `A list of accounts, see <a href="/#tag/Account">Account</a>`,
                }));
                decorators.push((0, class_validator_1.IsArray)());
                break;
            case SwaggerPropertyReference.CONTACTS:
                decorators.push((0, swagger_1.ApiProperty)({
                    description: `A list of contacts, see <a href="/#tag/Contacts">Contacts</a>`,
                }));
                decorators.push((0, class_validator_1.IsArray)());
                break;
            case SwaggerPropertyReference.USER:
                decorators.push((0, swagger_1.ApiProperty)({
                    description: `The user this records relates to, see <a href="/#tag/Users">Users</a>`,
                }));
                decorators.push((0, class_validator_1.IsObject)());
                break;
            case SwaggerPropertyReference.USERS:
                decorators.push((0, swagger_1.ApiProperty)({
                    description: `A list of users, see <a href="/#tag/Users">Users</a>`,
                }));
                decorators.push((0, class_validator_1.IsArray)());
                break;
        }
    }
    if (!options.required) {
        decorators.push((0, class_validator_1.IsOptional)());
    }
    if (options.hidden) {
        decorators.push((0, swagger_1.ApiHideProperty)());
    }
    if (!options.hidden) {
        decorators.push((0, swagger_1.ApiProperty)({
            description: options.description,
            example: options.example,
            required: options.required,
            enum: options.enum,
        }));
    }
    let typeDecorator;
    switch (options.type) {
        case SwaggerPropertyType.STRING:
            typeDecorator = (0, class_validator_1.IsString)();
            break;
        case SwaggerPropertyType.NUMBER:
            typeDecorator = (0, class_validator_1.IsNumber)();
            break;
        case SwaggerPropertyType.BOOLEAN:
            typeDecorator = (0, class_validator_1.IsBoolean)();
            break;
        case SwaggerPropertyType.DATE:
            typeDecorator = (0, class_validator_1.IsDate)();
            break;
        case SwaggerPropertyType.ARRAY:
            typeDecorator = (0, class_validator_1.IsArray)();
            break;
        case SwaggerPropertyType.OBJECT:
            typeDecorator = (0, class_validator_1.IsObject)();
            break;
        case SwaggerPropertyType.ENUM:
            typeDecorator = (0, class_validator_1.IsEnum)(options.enum);
            break;
        case SwaggerPropertyType.EMAIL:
            typeDecorator = (0, class_validator_1.IsEmail)();
            break;
        default:
            typeDecorator = (0, class_validator_1.IsString)();
    }
    decorators.push(typeDecorator);
    return (0, common_1.applyDecorators)(...decorators);
}
exports.SwaggerPropertyDecorator = SwaggerPropertyDecorator;
//# sourceMappingURL=Swagger.decorator.js.map