import 'module-alias/register'
import 'reflect-metadata'
import { Enviroment, Logger } from '@juicyllama/utils'
import { NestFactory } from '@nestjs/core'
import { SandboxModule } from './sandbox.module'

const domain = 'main::bootstrap'
const logger = new Logger()

async function bootstrap() {
	const app = await NestFactory.create(SandboxModule, {
		logger: new Logger(),
		cors: true,
	})

	app.listen(process.env.PORT_SANDBOX)
	logger.debug(
		`[${domain}] ${Enviroment[process.env.NODE_ENV]} server running: ${process.env.BASE_URL_SANDBOX}:${
			process.env.PORT_SANDBOX
		}`,
	)
}

try {
	bootstrap()
} catch (e) {
	logger.error(`[${domain}] ${e.message}`, e)
}
