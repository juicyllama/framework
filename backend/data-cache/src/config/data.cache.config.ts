import { registerAs, ConfigModule } from '@nestjs/config'
import { Security, Env } from '@juicyllama/utils'
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import path from 'path'
import { DATA_CAHCE_NAME } from '../module/data.cache.constants'

export default registerAs(
	'mongodb',
	() =>
		<TypeOrmModuleAsyncOptions>{
			name: DATA_CAHCE_NAME,
			imports: [ConfigModule],
			useFactory: async () => {
				return {
					type: 'mongodb',
					url: buildMongoURLFromAPIKey(),
					entities: [path.resolve(__dirname, '**', '*.entity.mongo.{ts,js}')],
					autoLoadEntities: true,
					synchronize: false,
					useUnifiedTopology: true,
					useNewUrlParser: true,
					ssl: Env.IsProd() || Env.IsSandbox(),
					authSource: Env.IsProd() || Env.IsSandbox() ? 'admin' : null,
				}
			},
		},
)

function buildMongoURLFromAPIKey(): string {
	const { username, password } = <{ client_id: number; username: string; password: string }>(
		Security.decode(process.env.JUICYLLAMA_DATA_CACHE_API_KEY)
	)
	return `mongodb+srv://${username}:${password}@juicyllama.xcb5lth.mongodb.net/juicyllama?retryWrites=true&w=majority&ssl=true&authSource=admin`
}
