import { registerAs } from '@nestjs/config'
import { ConfigService } from '@nestjs/config'
import { CacheStore } from '@nestjs/common/cache/interfaces/cache-manager.interface'
import { redisStore } from 'cache-manager-redis-store'

export default registerAs(
	'cache',
	() =>
		<any>{
			isGlobal: true,
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const store = await redisStore({
					socket: {
						host: configService.get('REDIS_HOST'),
						port: +configService.get('REDIS_PORT'),
					},
					password: configService.get('REDIS_PASSWORD'),
				})
				return {
					store: store as unknown as CacheStore,
					ttl: 5,
				}
			},
		},
)
