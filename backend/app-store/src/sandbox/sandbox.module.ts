import { forwardRef, Module } from '@nestjs/common'
import { AppsModule } from '../index'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'
import { cacheConfig, jwtConfig, databaseConfig } from '@juicyllama/core'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.registerAsync(cacheConfig()),
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		forwardRef(() => AppsModule),
	],
})
export class SandboxModule {}
