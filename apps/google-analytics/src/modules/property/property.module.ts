import { Module } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'

import { AuthModule } from '../auth/auth.module'
import { GoogleAnalyticsInstalledAppModule } from '../google-analytics-installed-app/google-analytics-installed-app.module'

import { PropertyController } from './property.controller'
import { PropertyService } from './property.service'

@Module({
	imports: [AuthModule, GoogleAnalyticsInstalledAppModule],
	controllers: [PropertyController],
	providers: [PropertyService, Logger],
})
export class PropertyModule {}
