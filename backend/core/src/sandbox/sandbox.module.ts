import { Env } from '@juicyllama/utils'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import Joi from 'joi'
import { databaseConfig, joiConfigJoi, ssoConfig } from '../configs'
import cacheConfig from '../configs/cache.config'
import jwtConfig from '../configs/jwt.config'
import { ssoConfigJoi } from '../configs/sso.config.joi'
import { CoreModule } from '../modules/core.module'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		ConfigModule.forRoot({
			load: [jwtConfig, cacheConfig, ssoConfig],
			isGlobal: true,
			envFilePath: '.env',
			validationSchema: Env.IsNotTest() ? Joi.object({ ...joiConfigJoi, ...ssoConfigJoi }) : null,
		}),
		CacheModule.registerAsync(cacheConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		CoreModule,
	],
})
export class SandboxModule {}
