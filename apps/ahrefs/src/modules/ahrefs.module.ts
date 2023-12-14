import { AppsModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { AhrefsInstallationService } from './ahrefs.installation'

@Module({
	imports: [AppsModule],
	providers: [AhrefsInstallationService, Logger],
	exports: [],
})
export class AhrefsModule {}
