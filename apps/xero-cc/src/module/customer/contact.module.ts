import { Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth'
import { XeroContact } from './contact.entity'
import { ContactService } from './contact.service'

@Module({
	imports: [TypeOrmModule.forFeature([XeroContact]), AuthModule],
	controllers: [],
	providers: [ContactService, Logger, Query],
	exports: [ContactService],
})
export class ContactModule {}
