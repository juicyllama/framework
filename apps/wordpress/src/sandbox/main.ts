import 'module-alias/register'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import 'reflect-metadata'
import { Enviroment, Logger } from '@juicyllama/utils'
import { SandboxModule } from './sandbox.module'
import { TypeOrmFilter, validationPipeOptions } from '@juicyllama/core'

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
		`[${domain}] ${Enviroment[process.env.NODE_ENV]} server running: ${process.env.BASE_URL}:${process.env.PORT}`,
	)
}

try {
	bootstrap()
} catch (e: any) {
	logger.error(`[${domain}] ${e.message}`, e)
}
