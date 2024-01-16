import { Env, Logger } from '@juicyllama/utils'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'module-alias/register'
import 'reflect-metadata'
import { TypeOrmFilter, redocConfig, validationPipeOptions } from '../index'
import { RedocModule } from '../utils/redoc'
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

	if (!process.env.BASE_URL_API) {
		throw new Error('BASE_URL_API is not set')
	}

	try {
		const swagger_document = new DocumentBuilder()
			.setTitle('SANDBOX API')
			.setVersion(process.env.npm_package_version || '0.0.0')
			.addServer(process.env.BASE_URL_API, 'Live')
			//.addServer(`https://sandbox.${process.env.BASE_URL_API.replace('https://', '')}`, 'Sandbox')
			.addBearerAuth()
			.build()

		const document = SwaggerModule.createDocument(app, swagger_document)
		await RedocModule.setup('', app, document, redocConfig, true)
	} catch (e) {
		const error = e as Error
		logger.error(`[${domain}] ${error.message}`, error)
	}

	app.listen(process.env.PORT || 3000)
	logger.debug(`[${domain}] ${Env.get()} server running: ${process.env.BASE_URL_API}`)
}

try {
	bootstrap()
} catch (e) {
	const error = e as Error
	logger.error(`[${domain}] ${error.message}`, error)
}
