import 'module-alias/register'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'reflect-metadata'
import { Enviroment, Logger, Strings } from '@juicyllama/utils'
import { RedocModule } from '../utils/redoc'
import { redocConfig, TypeOrmFilter, validationPipeOptions } from '../index'
import { SandboxModule } from './sandbox.module'

const domain = 'main::bootstrap'
const logger = new Logger()

async function bootstrap() {
	const app = await NestFactory.create(SandboxModule, {
		logger: new Logger(),
		cors: true,
	})

	app.useGlobalPipes(new ValidationPipe(validationPipeOptions))
	app.useGlobalFilters(new TypeOrmFilter())

	try {
		const swagger_document = new DocumentBuilder()
			.setTitle(Strings.capitalize(process.env.PROJECT_NAME))
			.setVersion(process.env.npm_package_version)
			.addServer(process.env.BASE_URL_API, 'Live')
			//.addServer(`https://sandbox.${process.env.BASE_URL_API.replace('https://', '')}`, 'Sandbox')
			.addBearerAuth()
			.build()

		const document = SwaggerModule.createDocument(app, swagger_document)
		await RedocModule.setup('', app, document, redocConfig, true)
	} catch (e) {
		logger.error(`[${domain}] ${e.message}`, e)
	}

	app.listen(process.env.PORT)
	logger.debug(`[${domain}] ${Enviroment[process.env.NODE_ENV]} server running: ${process.env.BASE_URL_API}`)
}

try {
	bootstrap()
} catch (e) {
	logger.error(`[${domain}] ${e.message}`, e)
}
