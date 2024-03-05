import { CoreModule } from '@juicyllama/core'
import { Module } from '@nestjs/common'
import { EcommerceModule } from '../ecommerce.module'

@Module({
	imports: [CoreModule, EcommerceModule],
})
export class SandboxModule {}
