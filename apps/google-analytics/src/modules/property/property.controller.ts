import { Controller, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { PropertyInstallDto } from './property-install.dto';
import { AppScope, AppsService, AppStoreIntegrationName, InstalledAppsService } from '@juicyllama/app-store';
import { PropertyService } from './property.service';
import { Logger } from '@juicyllama/utils';
import { PropertyInstalledApp } from './property-app.entity';

@Controller('property')
export class PropertyController {
	constructor(
		private readonly logger: Logger,
		private readonly appsService: AppsService,
		private readonly installedAppsService: InstalledAppsService,
		private readonly propertyService: PropertyService
	) {}

	@Post('install')
	async install(@Body() dto: PropertyInstallDto) {
		const app = await this.appsService.findOne({ where: { integration_name: AppStoreIntegrationName.ga4 } })

		if (!app) {
			throw new BadRequestException('Ga4 app is not installed');
		}

		const created = await this.installedAppsService.create({
			app_id: app.app_id,
			name: `GA4: ${dto.propertyId}`,
			scope: AppScope.ACCOUNT,
			settings: {
				GOOGLE_ANALYTICS_PROPERTY_ID: dto.propertyId,
			},
		});

		return created;
	}

	@Post('run-report')
	async runReport(@Query('installed_app_id') installedAppId: number) {
		const domain = 'app::google-analytics::property::controller::run-report'

		const app = await this.loadInstalledApp(installedAppId, domain)

		return await this.propertyService.runReport(app)
	}

	private async loadInstalledApp(id: number, domain: string): Promise<PropertyInstalledApp> {
		const app = await this.installedAppsService.findOne({
			where: { installed_app_id: id },
		})

		if (!app) {
			this.logger.error(`[${domain}] Authentication Error: Installed App not found`, {
				installed_app_id: id,
			})
			throw new BadRequestException(`Authentication Error: Installed App not found`)
		}

		return app as PropertyInstalledApp;
	}
}
