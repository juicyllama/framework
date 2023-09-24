import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { StorageModule } from '../storage/storage.module.js'
import { AuthModule } from '../auth/auth.module.js'
import { UsersService } from './users.service.js'
import { UsersHooks } from './users.hooks.js'
import { databaseConfig, jwtConfig } from '../../configs/index.js'
import { User } from './users.entity.js'
import { Logger } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query.js'
import { BeaconModule } from '../beacon/beacon.module.js'
import { AccountModule } from '../accounts/account.module.js'
import { UsersController } from './users.controller.js'
import { MiddlewareAccountId } from '../../middleware/index.js'
import { CsvModule } from '../csv/csv.module.js'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([User]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => StorageModule),
		forwardRef(() => CsvModule),
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
