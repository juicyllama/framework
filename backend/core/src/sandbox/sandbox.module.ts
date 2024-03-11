import { Env } from '@juicyllama/utils'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import Joi from 'joi'
import { ConfigValidationModule } from '..'
import { SSOConfigDto, databaseConfig, joiConfigJoi } from '../configs'
import cacheConfig from '../configs/cache.config'
import jwtConfig from '../configs/jwt.config'
import { CoreModule } from '../modules/core.module'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		ConfigModule.forRoot({
			load: [jwtConfig, cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
			validationSchema: Env.IsNotTest() ? Joi.object(joiConfigJoi) : null,
		}),
		CacheModule.registerAsync(cacheConfig()),
		ConfigValidationModule.register(SSOConfigDto),
		TypeOrmModule.forRoot(databaseConfig()),
		CoreModule,
	],
})
export class SandboxModule {}
