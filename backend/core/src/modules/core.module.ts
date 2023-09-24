import { forwardRef, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import jwtConfig from '../configs/jwt.config.js'
import { databaseConfig, joiConfigJoi, ssoConfig } from '../configs/index.js'
import cacheConfig from '../configs/cache.config.js'
import mongodbConfig from '../configs/mongodb.config.js'
import { AccountModule } from './accounts/account.module.js'
import { UsersModule } from './users/users.module.js'
import Joi from 'joi'
import { ssoConfigJoi } from '../configs/sso.config.joi.js'
import { Env } from '@juicyllama/utils'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		ConfigModule.forRoot({
			load: [mongodbConfig, jwtConfig, cacheConfig, ssoConfig],
			isGlobal: true,
			envFilePath: '.env',
			validationSchema: Env.IsNotTest() ? Joi.object({ ...joiConfigJoi, ...ssoConfigJoi }) : null,
		}),
		CacheModule.registerAsync(cacheConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forRootAsync(mongodbConfig()),
		forwardRef(() => AccountModule),
		forwardRef(() => UsersModule),
	],
	controllers: [],
	providers: [],
})
export class CoreModule {}
