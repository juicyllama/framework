import { CacheStore } from '@nestjs/cache-manager'
import { registerAs } from '@nestjs/config'
import { redisStore } from 'cache-manager-redis-store'

export default registerAs(
	'cache',
	() =>
		<any>{
			isGlobal: true,
			useFactory: async () => {
				if (!process.env.REDIS_HOST) {
					throw new Error('REDIS_HOST must be set')
				}
				const store = await redisStore({
					socket: {
						host: process.env.REDIS_HOST,
						port: +(process.env.REDIS_PORT || 6379),
					},
					password: process.env.REDIS_PASSWORD,
				})
				return {
					store: store as unknown as CacheStore,
					ttl: 5,
				}
			},
		},
)
