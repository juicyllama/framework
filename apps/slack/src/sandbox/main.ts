import 'module-alias/register'
import 'reflect-metadata'
import { Env, Logger } from '@juicyllama/utils'
import { NestFactory } from '@nestjs/core'
import { SandboxModule } from './sandbox.module'

const domain = 'main::bootstrap'
const logger = new Logger()

async function bootstrap() {
	const app = await NestFactory.create(SandboxModule, {
		logger: new Logger(),
		cors: true,
	})

	app.listen(Number(process.env.PORT_SANDBOX) || 3000)
	logger.debug(`[${domain}] ${Env.get()} server running: ${process.env.BASE_URL_SANDBOX}:${process.env.PORT_SANDBOX}`)
}

try {
	bootstrap()
} catch (err) {
	const e = err as Error
	logger.error(`[${domain}] ${e.message}`, e)
}
