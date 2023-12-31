import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { ConfigModule, registerAs } from '@nestjs/config'
import { MONGODB } from '../constants'
import path from 'path'
import { Env } from '@juicyllama/utils'

export default registerAs(
	MONGODB,
	() =>
		<TypeOrmModuleAsyncOptions>{
			name: MONGODB,
			imports: [ConfigModule],
			useFactory: async () => {
				return {
					type: MONGODB,
					name: MONGODB,
					url: process.env.MONGODB_URL,
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
