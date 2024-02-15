import { Logger } from '@juicyllama/utils'
import { forwardRef, MiddlewareConsumer, Module,  } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { databaseConfig, jwtConfig } from '../../configs'
import { MiddlewareAccountId } from '../../middleware'
import { Query } from '../../utils/typeorm/Query'
import { AccountModule } from '../accounts/account.module'
import { AuthModule } from '../auth/auth.module'
import { BeaconModule } from '../beacon/beacon.module'
import { StorageModule } from '../storage/storage.module'
import { UsersController } from './users.controller'
import { User } from './users.entity'
import { UsersHooks } from './users.hooks'
import { UsersService } from './users.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([User]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		StorageModule,
	],
	controllers: [UsersController],
	providers: [UsersService, UsersHooks, Logger, Query],
	exports: [UsersService],
})
export class UsersModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MiddlewareAccountId)
	}
}
