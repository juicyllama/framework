import { RedocModule, TypeOrmFilter, redocConfig, validationPipeOptions } from '@juicyllama/core'
import { Env, Logger, Strings } from '@juicyllama/utils'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'module-alias/register'
import 'reflect-metadata'
import { installAppStoreDocs } from '../docs/install'
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

	if (!process.env.PORT || !process.env.BASE_URL_API) {
		throw new Error(`BASE_URL_API is not defined`)
	}

	try {
		const swagger_document = new DocumentBuilder()
			.setTitle(process.env.PROJECT_NAME ? Strings.capitalize(process.env.PROJECT_NAME) : 'API Docs')
			.setVersion(process.env.npm_package_version || '0.0.0')
			.addServer(process.env.BASE_URL_API, 'Live')
			//.addServer(`https://sandbox.${process.env.BASE_URL_API.replace('https://', '')}`, 'Sandbox')
			.addBearerAuth()
			.build()

		const document = SwaggerModule.createDocument(app, swagger_document)
		logger.debug(`[${domain}] Loading Docs...`)
		let redoc = redocConfig
		redoc = installAppStoreDocs(redoc)
		logger.debug(`[${domain}] ...app store loaded`)
		await RedocModule.setup('', app, document, redoc, true)
	} catch (err) {
		const e = err as Error
		logger.error(`[${domain}] ${e.message}`, e)
	}

	app.listen(Number(process.env.PORT))
	logger.debug(`[${domain}] ${Env.get()} server running: ${process.env.BASE_URL_API}:${process.env.PORT}`)
}

try {
	bootstrap()
} catch (err) {
	const e = err as Error
	logger.error(`[${domain}] ${e.message}`, e)
}
