import { forwardRef, Module } from '@nestjs/common'
import { ContactsModule } from './contacts/contacts.module'
import { CrmCronsModule } from './crons/crm.crons.module'

@Module({
	imports: [forwardRef(() => ContactsModule), forwardRef(() => CrmCronsModule)],
})
export class CrmModule {}
