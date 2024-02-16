import { NestFactory } from '@nestjs/core'
import { ValidationPipe, INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { TypeOrmFilter, validationPipeOptions } from '@juicyllama/core'
import { Enviroment, Logger } from '@juicyllama/utils'

import { SandboxModule } from './sandbox.module'

import { GoogleAnalyticsOAuthModule } from '../modules/oauth/google-analytics.oauth.module'
import { GoogleAnalyticsPropertyModule } from '../modules/property/google-analytics.property.module'

const domain = 'main::bootstrap'
const logger = new Logger()

async function bootstrap() {
	const app = await NestFactory.create(SandboxModule, {
		logger: new Logger(),
		cors: true,
	})

	app.useGlobalPipes(new ValidationPipe(validationPipeOptions))
	app.useGlobalFilters(new TypeOrmFilter())

	setupDocs(app)

	app.listen(process.env.PORT)
	logger.debug(`[${domain}] ${Enviroment[process.env.NODE_ENV]} server running: ${process.env.BASE_URL_API}`)
}

function setupDocs(app: INestApplication, path = 'docs') {
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Google Analytics 4')
		.addBearerAuth()
		.setVersion(process.env.npm_package_version)
		.build()

	const document = SwaggerModule.createDocument(app, swaggerConfig, {
		include: [GoogleAnalyticsOAuthModule, GoogleAnalyticsPropertyModule],
	})
	SwaggerModule.setup(path, app, document)
}

bootstrap().catch(e => {
	logger.error(`[${domain}] ${e.message}`, e)
})
