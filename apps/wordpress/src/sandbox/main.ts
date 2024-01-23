import 'module-alias/register'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import 'reflect-metadata'
import { Env, Logger } from '@juicyllama/utils'
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

	app.listen(Number(process.env.PORT) || 3000)
	logger.debug(
		`[${domain}] ${Env.get()} server running: ${process.env.BASE_URL_API}:${
			process.env.PORT
		}`,
	)
}

try {
	bootstrap()
} catch (err) {
	const e = err as Error
	logger.error(`[${domain}] ${e.message}`, e)
	throw e
}
