import { forwardRef, Module } from '@nestjs/common'
import { WiseInstallationService } from './wise.installation'
import { WiseService } from './wise.service'
import { WiseBalanceModule } from './balances/wise.balance.module'
import { WiseWebhooksModule } from './webhooks/wise.webhooks.module'
import { Api, Logger } from '@juicyllama/utils'

@Module({
	imports: [forwardRef(() => WiseBalanceModule), forwardRef(() => WiseWebhooksModule)],
	controllers: [],
	providers: [WiseInstallationService, WiseService, Logger, Api],
	exports: [WiseService],
})
export class WiseModule {}
