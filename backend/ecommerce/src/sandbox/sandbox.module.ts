import { forwardRef, Module } from '@nestjs/common'
import { CoreModule } from '@juicyllama/core'
import { EcommerceModule } from '../ecommerce.module'

@Module({
	imports: [
		forwardRef(() => CoreModule),
		forwardRef(() => EcommerceModule)
	],
})
export class SandboxModule {}
