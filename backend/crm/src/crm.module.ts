import { Module } from '@nestjs/common'
import { ContactsModule } from './modules/contacts/contacts.module'
import { CrmCronsModule } from './modules/contacts/crm.crons.module'

@Module({
	imports: [ContactsModule, CrmCronsModule],
})
export class CrmModule {}
