import { Logger } from '@juicyllama/utils'
import { Injectable, Inject, OnApplicationShutdown } from '@nestjs/common'
import { Server } from 'socket.io'
import Redis from 'ioredis'
import { REDIS_PUB_CLIENT, WEBSOCKETS_REDIS_CHANNEL } from './websocket.constants'

@Injectable()
export class WebsocketService implements OnApplicationShutdown {
	private server: Server | null = null
	private connectedUserSockets: Map<number, string> = new Map() // user_id -> socket_id

	constructor(
		private readonly logger: Logger,
		@Inject(REDIS_PUB_CLIENT) private readonly redisPubClient: Redis,
	) {}

	onApplicationShutdown() {
		this.redisPubClient.disconnect()
		// Add more disconnect calls if you have multiple Redis clients
	}

	public async emit(event: string, data: any, userId?: number) {
		this.logger.debug(`Emitting event ${event} to user ${userId || 'all'}`)
		if (this.redisPubClient.status !== 'ready') {
			throw new Error('Redis client not ready')
		}
		await this.redisPubClient.publish(WEBSOCKETS_REDIS_CHANNEL, JSON.stringify({ event, data, userId }))
	}
}
