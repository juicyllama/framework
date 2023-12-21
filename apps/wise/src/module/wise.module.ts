import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { WiseBalanceModule } from './balances/wise.balance.module'
import { WiseWebhooksModule } from './webhooks/wise.webhooks.module'
import { WiseInstallationService } from './wise.installation'
import { WiseService } from './wise.service'

@Module({
	imports: [WiseBalanceModule, WiseWebhooksModule],
	controllers: [],
	providers: [WiseInstallationService, WiseService, Logger, Api],
	exports: [WiseService],
})
export class WiseModule {}
