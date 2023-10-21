import { forwardRef, Module } from '@nestjs/common'
import { WebsiteModule } from './websites/websites.module'

@Module({
	imports: [
		forwardRef(() => WebsiteModule)
	],
})
export class WebsitesModule {}
