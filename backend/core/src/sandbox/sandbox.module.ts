import { forwardRef, Module } from '@nestjs/common'
import { CoreModule } from '../modules/core.module'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import jwtConfig from '../configs/jwt.config'
import { databaseConfig, joiConfigJoi, ssoConfig } from '../configs'
import cacheConfig from '../configs/cache.config'
import Joi from 'joi'
import { ssoConfigJoi } from '../configs/sso.config.joi'
import { Env } from '@juicyllama/utils'

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
		forwardRef(() => CoreModule),
	],
})
export class SandboxModule {}
