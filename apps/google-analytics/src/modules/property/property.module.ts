import { Module } from '@nestjs/common'
import { InstalledAppsModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'

import { AuthModule } from '../auth/auth.module'

import { PropertyController } from './property.controller'
import { PropertyService } from './property.service'

@Module({
	imports: [InstalledAppsModule, AuthModule],
	controllers: [PropertyController],
	providers: [PropertyService, Logger],
})
export class PropertyModule {}
