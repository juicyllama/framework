import { BadRequestException, NotFoundException } from '@nestjs/common'

import { GoogleAnalyticsInstalledAppService } from './google-analytics-installed-app/google-analytics-installed-app.service'

export abstract class GoogleAnalyticsBaseController {
	protected constructor(protected readonly gaInstalledAppService: GoogleAnalyticsInstalledAppService) {}

	protected async loadInstalledApp(id: number, accountId: number) {
		try {
			return await this.gaInstalledAppService.load(id, accountId)
		} catch (e) {
			if (e instanceof GoogleAnalyticsInstalledAppService.AppNotFoundException) {
				throw new NotFoundException(`Installed App ${id} not found`)
			}

			if (e instanceof GoogleAnalyticsInstalledAppService.AppNotConfiguredException) {
				throw new BadRequestException(`Google Analytics ${e.property} not found in App settings`)
			}

			throw e
		}
	}
}
