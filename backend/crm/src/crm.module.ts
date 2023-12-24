import { forwardRef, Module } from '@nestjs/common'
import { ContactsModule } from './modules/contacts/contacts.module'
import { CrmCronsModule } from './modules/contacts/crm.crons.module'

@Module({
	imports: [forwardRef(() => ContactsModule), forwardRef(() => CrmCronsModule)],
})
export class CrmModule {}
