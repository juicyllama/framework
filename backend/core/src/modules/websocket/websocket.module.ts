import { Logger } from '@juicyllama/utils'
import { Module, Global } from '@nestjs/common'
import { WebsocketGateway } from './websocket.gateway'
import { WebsocketService } from './websocket.service'
import { REDIS_PUB_CLIENT, REDIS_SUB_CLIENT } from './websocket.constants'
import Redis from 'ioredis'

function createRedisClient() {
	if (!process.env.REDIS_PORT || !process.env.REDIS_HOST) {
		throw new Error('REDIS_PORT or REDIS_HOST not found')
	}
	return new Redis(+process.env.REDIS_PORT, process.env.REDIS_HOST, {})
}

@Global()
@Module({
	providers: [
		Logger,
		WebsocketGateway,
		WebsocketService,
		{
			provide: REDIS_PUB_CLIENT,
			useFactory: createRedisClient,
		},
		{
			provide: REDIS_SUB_CLIENT,
			useFactory: createRedisClient,
		},
	],
	exports: [WebsocketService, WebsocketGateway, REDIS_PUB_CLIENT, REDIS_SUB_CLIENT],
})
export class WebsocketModule {}
