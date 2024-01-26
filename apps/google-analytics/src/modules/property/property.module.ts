import { Module } from '@nestjs/common';
import { InstalledAppsModule, AppsModule } from '@juicyllama/app-store';
import { Logger } from '@juicyllama/utils';

import { GoogleAnalyticsProviderModule } from '../provider/provider.module';

import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';

@Module({
	imports: [InstalledAppsModule, AppsModule, GoogleAnalyticsProviderModule],
	controllers: [PropertyController],
	providers: [PropertyService, Logger]
})
export class PropertyModule {}
