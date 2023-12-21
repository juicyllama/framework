import 'module-alias/register'
import 'reflect-metadata'
import { TypeOrmFilter, validationPipeOptions } from '@juicyllama/core'
import { Enviroment, Logger } from '@juicyllama/utils'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
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

	app.listen(process.env.PORT)
	logger.debug(
		`[${domain}] ${Enviroment[process.env.NODE_ENV]} server running: ${process.env.BASE_URL_API}:${
			process.env.PORT
		}`,
	)
}

try {
	bootstrap()
} catch (e) {
	logger.error(`[${domain}] ${e.message}`, e)
}
