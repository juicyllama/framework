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
require("module-alias/register");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
require("reflect-metadata");
const utils_1 = require("@juicyllama/utils");
const nestjs_redoc_1 = require("@juicyllama/nestjs-redoc");
const index_1 = require("../index");
const sandbox_module_1 = require("./sandbox.module");
const domain = 'main::bootstrap';
const logger = new utils_1.Logger();
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(sandbox_module_1.SandboxModule, {
            logger: new utils_1.Logger(),
            cors: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe(index_1.validationPipeOptions));
        app.useGlobalFilters(new index_1.TypeOrmFilter());
        try {
            const swagger_document = new swagger_1.DocumentBuilder()
                .setTitle(utils_1.Strings.capitalize(process.env.PROJECT_NAME))
                .setVersion(process.env.npm_package_version)
                .addServer(process.env.BASE_URL_API, 'Live')
                .addBearerAuth()
                .build();
            const document = swagger_1.SwaggerModule.createDocument(app, swagger_document);
            yield nestjs_redoc_1.RedocModule.setup('', app, document, index_1.redocConfig, true);
        }
        catch (e) {
            logger.error(`[${domain}] ${e.message}`, e);
        }
        app.listen(process.env.PORT);
        logger.debug(`[${domain}] ${utils_1.Enviroment[process.env.NODE_ENV]} server running: ${process.env.BASE_URL_API}`);
    });
}
try {
    bootstrap();
}
catch (e) {
    logger.error(`[${domain}] ${e.message}`, e);
}
//# sourceMappingURL=main.js.map