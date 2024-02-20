import { ConfigValidationModule, cacheConfig } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { XeroConfigDto } from '../../config/xero.config.dto'
import { AuthService } from './auth.service'

@Module({
	imports: [ConfigValidationModule.register(XeroConfigDto), CacheModule.registerAsync(cacheConfig())],
	providers: [AuthService, Logger],
	exports: [AuthService],
})
export class AuthModule {}
