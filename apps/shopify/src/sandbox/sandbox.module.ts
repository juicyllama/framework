import { forwardRef, Module } from '@nestjs/common'
import { ShopifyModule } from '../modules/shopify.module'

@Module({
	imports: [forwardRef(() => ShopifyModule)],
})
export class SandboxModule {}
