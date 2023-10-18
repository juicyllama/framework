import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { StorageModule } from '../storage/storage.module'
import { AuthModule } from '../auth/auth.module'
import { UsersService } from './users.service'
import { UsersHooks } from './users.hooks'
import { databaseConfig, jwtConfig } from '../../configs'
import { User } from './users.entity'
import { Logger } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query'
import { BeaconModule } from '../beacon/beacon.module'
import { AccountModule } from '../accounts/account.module'
import { UsersController } from './users.controller'
import { MiddlewareAccountId } from '../../middleware'
import { Account } from '../accounts/account.entity'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Account, User]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => StorageModule),
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
