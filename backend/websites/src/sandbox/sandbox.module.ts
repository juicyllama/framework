import { CoreModule } from '@juicyllama/core'
import { Module } from '@nestjs/common'
import { WebsitesModule } from '../modules/websites/websites.module'

@Module({
	imports: [CoreModule, WebsitesModule],
})
export class SandboxModule {}
