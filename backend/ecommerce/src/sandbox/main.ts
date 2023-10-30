import 'module-alias/register'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'reflect-metadata'
import { Enviroment, Logger } from '@juicyllama/utils'
import { RedocModule, redocConfig, TypeOrmFilter, validationPipeOptions } from '@juicyllama/core'
import { SandboxModule } from './sandbox.module'
import { installEcommerceDocs } from '../docs/install'

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
			.setTitle('SANDBOX API')
			.setVersion(process.env.npm_package_version)
			.addServer(process.env.BASE_URL_API, 'Live')
			.addBearerAuth()
			.build()

		const document = SwaggerModule.createDocument(app, swagger_document)

		let redoc = redocConfig
		redoc = installEcommerceDocs(redoc)

		await RedocModule.setup('', app, document, redoc, true)
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
