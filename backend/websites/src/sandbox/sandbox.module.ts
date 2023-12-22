import { forwardRef, Module } from '@nestjs/common'
import { CoreModule } from '@juicyllama/core'
import { WebsitesModule } from '../modules/websites/websites.module'

@Module({
	imports: [forwardRef(() => CoreModule), forwardRef(() => WebsitesModule)],
})
export class SandboxModule {}
