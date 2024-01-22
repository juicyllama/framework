import { RedocModule, TypeOrmFilter, redocConfig, validationPipeOptions } from '@juicyllama/core'
import { Env, Logger } from '@juicyllama/utils'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'module-alias/register'
import 'reflect-metadata'
import { installEcommerceDocs } from '../docs/install'
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

	if (!process.env.BASE_URL_API || !process.env.PORT) {
		throw new Error('Missing BASE_URL_API')
	}

	try {
		const swagger_document = new DocumentBuilder()
			.setTitle('SANDBOX API')
			.setVersion(process.env.npm_package_version || '0.0.0')
			.addServer(process.env.BASE_URL_API, 'Live')
			.addBearerAuth()
			.build()

		const document = SwaggerModule.createDocument(app, swagger_document)

		let redoc = redocConfig
		redoc = installEcommerceDocs(redoc)

		await RedocModule.setup('', app, document, redoc, true)
	} catch (err) {
		const e = err as Error
		logger.error(`[${domain}] ${e.message}`, e)
	}

	app.listen(Number(process.env.PORT))
	logger.debug(`[${domain}] ${Env.get()} server running: ${process.env.BASE_URL_API}`)
}

try {
	bootstrap()
} catch (err) {
	const e = err as Error
	logger.error(`[${domain}] ${e.message}`, e)
}
