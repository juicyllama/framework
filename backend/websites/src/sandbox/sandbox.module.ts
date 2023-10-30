import { forwardRef, Module } from '@nestjs/common'
import { CoreModule } from '@juicyllama/core'
import { WebsitesModule } from '../websites.module'

@Module({
	imports: [
		forwardRef(() => CoreModule),
		forwardRef(() => WebsitesModule),
		],
})
export class SandboxModule {}
