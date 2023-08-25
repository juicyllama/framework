"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDecorator = exports.UploadCSVDecorator = exports.UploadFileDecorator = exports.UpdateDecorator = exports.ReadOneDecorator = exports.ReadChartsDecorator = exports.ReadStatsDecorator = exports.ReadManyDecorator = exports.CreateDecorator = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const utils_1 = require("@juicyllama/utils");
const platform_express_1 = require("@nestjs/platform-express");
function CreateDecorator(E, name) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: `Create ${utils_1.Strings.capitalize(name)}` }), (0, swagger_1.ApiCreatedResponse)(generateResponseObject(E, 'Created')), (0, common_1.Post)());
}
exports.CreateDecorator = CreateDecorator;
function ReadManyDecorator(E, SelectEnum, OrderByEnum, RelationsEnum, name) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: name ? `List ${utils_1.Strings.capitalize(utils_1.Strings.plural(name))}` : 'List' }), (0, swagger_1.ApiQuery)({
        name: 'select',
        description: 'If you wish to specify which items you would like returning (boost performance)',
        type: [String],
        isArray: true,
        explode: false,
        required: false,
        enum: SelectEnum,
    }), (0, swagger_1.ApiQuery)({
        name: 'order_by',
        description: 'Order the results by a specific field',
        type: String,
        required: false,
        enum: OrderByEnum,
    }), (0, swagger_1.ApiQuery)({
        name: 'order_by_type',
        description: 'Either `ASC` or `DESC`',
        type: String,
        required: false,
        example: 'DESC',
    }), (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: 'The number of records to return',
        type: 'number',
        required: false,
    }), (0, swagger_1.ApiQuery)({
        name: 'offset',
        description: 'The number of records to skip',
        type: 'number',
        required: false,
    }), (0, swagger_1.ApiQuery)({
        name: 'relations',
        description: 'Fetch the relations in the same request',
        type: [String],
        isArray: true,
        explode: false,
        required: false,
        enum: RelationsEnum,
    }), (0, swagger_1.ApiQuery)({
        name: 'search',
        description: 'Filter the results by a value',
        type: String,
        required: false,
    }), ...generateSelectRHSFilteringAPIQueries(SelectEnum), (0, swagger_1.ApiOkResponse)(generateResponseObject(E, 'OK')), (0, common_1.Get)());
}
exports.ReadManyDecorator = ReadManyDecorator;
function ReadStatsDecorator(name) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: name ? `${utils_1.Strings.capitalize(name)} Stats` : 'Stats' }), (0, swagger_1.ApiQuery)({
        name: 'method',
        description: `The method you would like to run, defaults to \`${utils_1.StatsMethods.COUNT}\``,
        type: String,
        required: false,
        example: utils_1.StatsMethods.COUNT,
        enum: [utils_1.StatsMethods.COUNT],
    }), (0, swagger_1.ApiQuery)({
        name: 'search',
        description: 'Filter the results by a value',
        type: String,
        required: false,
    }), (0, swagger_1.ApiOkResponse)(generateResponseObject(utils_1.StatsResponseDto, 'OK')), (0, common_1.Get)('stats'));
}
exports.ReadStatsDecorator = ReadStatsDecorator;
function ReadChartsDecorator(E, SelectEnum, name) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: name ? `${utils_1.Strings.capitalize(name)} Charts` : 'Charts' }), (0, swagger_1.ApiQuery)({
        name: 'fields',
        description: `The fields by which you would like to group the data`,
        type: [String],
        required: false,
        example: ['first_name'],
    }), (0, swagger_1.ApiQuery)({
        name: 'from',
        description: `The date you would like to start from`,
        type: Date,
        required: false,
        example: '2023-08-08T11:21:13.406Z',
    }), (0, swagger_1.ApiQuery)({
        name: 'to',
        description: `The date you would like to end in`,
        type: Date,
        required: false,
        example: '2023-08-08T11:21:13.406Z',
    }), (0, swagger_1.ApiQuery)({
        name: 'period',
        description: `The interval you would like to group the data by. Optional, defaults to none.`,
        type: String,
        required: false,
        example: utils_1.ChartsPeriod.DAY,
        enum: [
            utils_1.ChartsPeriod.MIN,
            utils_1.ChartsPeriod['15MIN'],
            utils_1.ChartsPeriod['30MIN'],
            utils_1.ChartsPeriod.HOUR,
            utils_1.ChartsPeriod.DAY,
            utils_1.ChartsPeriod.WEEK,
            utils_1.ChartsPeriod.MONTH,
            utils_1.ChartsPeriod.YEAR,
        ],
    }), (0, swagger_1.ApiQuery)({
        name: 'search',
        description: 'Filter the results by a value',
        type: String,
        required: false,
    }), ...generateSelectRHSFilteringAPIQueries(SelectEnum), (0, swagger_1.ApiOkResponse)(generateResponseObject(utils_1.ChartsResponseDto, 'OK')), (0, common_1.Get)('charts'));
}
exports.ReadChartsDecorator = ReadChartsDecorator;
function ReadOneDecorator(E, PRIMARY_KEY, SelectEnum, RelationsEnum, name) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: `Get ${utils_1.Strings.capitalize(name)}` }), (0, swagger_1.ApiParam)({
        name: PRIMARY_KEY,
        description: `The ${PRIMARY_KEY} for the record you wish to return`,
        type: Number,
        required: true,
        example: 1,
    }), (0, swagger_1.ApiQuery)({
        name: 'select',
        description: 'If you wish to specify which items you would like returning (boost performance)',
        type: [String],
        isArray: true,
        explode: false,
        required: false,
        enum: SelectEnum,
    }), (0, swagger_1.ApiQuery)({
        name: 'relations',
        description: 'Fetch the relations in the same request',
        type: [String],
        isArray: true,
        explode: false,
        required: false,
        enum: RelationsEnum,
    }), ...generateSelectRHSFilteringAPIQueries(SelectEnum), (0, swagger_1.ApiOkResponse)(generateResponseObject(E, 'OK')), (0, common_1.Get)(`:${PRIMARY_KEY}`));
}
exports.ReadOneDecorator = ReadOneDecorator;
function UpdateDecorator(E, PRIMARY_KEY, name) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: `Update ${utils_1.Strings.capitalize(name)}` }), (0, swagger_1.ApiParam)({
        name: PRIMARY_KEY,
        description: `The ${PRIMARY_KEY} for the ${name} you wish to return`,
        type: Number,
        required: true,
        example: 1,
    }), (0, swagger_1.ApiOkResponse)(generateResponseObject(E, 'OK')), (0, common_1.Patch)(`:${PRIMARY_KEY}`));
}
exports.UpdateDecorator = UpdateDecorator;
function UploadFileDecorator(E) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiQuery)({
        name: 'file',
        description: 'A `jpg|jpeg|png|gif` file',
        type: 'File',
        required: true,
    }), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')), (0, swagger_1.ApiOkResponse)(generateResponseObject(E, 'OK')));
}
exports.UploadFileDecorator = UploadFileDecorator;
function UploadCSVDecorator() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiQuery)({
        name: 'file',
        description: 'A `csv` file',
        type: 'File',
        required: true,
    }), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')), (0, swagger_1.ApiOkResponse)({ description: 'OK' }));
}
exports.UploadCSVDecorator = UploadCSVDecorator;
function DeleteDecorator(E, PRIMARY_KEY, name) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: `Delete ${utils_1.Strings.capitalize(name)}` }), (0, swagger_1.ApiParam)({
        name: PRIMARY_KEY,
        description: `The ${PRIMARY_KEY} for the ${name} you wish to delete`,
        type: Number,
        required: true,
        example: 1,
    }), (0, swagger_1.ApiOkResponse)(generateResponseObject(E, 'OK')), (0, common_1.Delete)(`:${PRIMARY_KEY}`));
}
exports.DeleteDecorator = DeleteDecorator;
function generateResponseObject(type, description) {
    return {
        type: type,
        description: description,
    };
}
function generateSelectRHSFilteringAPIQueries(SelectEnum) {
    const selectFields = utils_1.Enums.toArray(SelectEnum, 'key', 'value').map(f => f.value);
    const comparisonOperators = utils_1.Enums.toArray(utils_1.ComparisonOperator, 'key', 'value').map(f => `\`${f.value}\``);
    return selectFields.map(f => (0, swagger_1.ApiQuery)({
        name: f,
        description: `Filter results by \`${f}\`. Example values: \`EQ:Tom\`, \`GT:7\`. Possible operators: ${comparisonOperators.join(', ')}`,
        type: String,
        required: false,
    }));
}
//# sourceMappingURL=crud.decorator.js.map