// Entities
import { Contact } from './contacts/contacts.entity'
import { ContactAddress } from './contacts/address/address.entity'
import { ContactEmail } from './contacts/email/email.entity'
import { ContactPhone } from './contacts/phone/phone.entity'
import { ContactSocial } from './contacts/social/social.entity'

// Modules
import { CrmModule } from './crm.module'
import { CrmCronsModule } from './crons/crm.crons.module'
import { ContactsModule } from './contacts/contacts.module'

// Controllers
import { ContactsController } from './contacts/contacts.controller'
import { CRMCronsController } from './crons/crm.cron.controller'

// Services
import { ContactsService } from './contacts/contacts.service'
import { CrmCronsContactsService } from './crons/crm.crons.contacts.service'
import { ContactAddressService } from './contacts/address/address.service'
import { ContactEmailService } from './contacts/email/email.service'
import { ContactPhoneService } from './contacts/phone/phone.service'
import { ContactSocialService } from './contacts/social/social.service'

// Enums
import { ContactSelect, ContactRelations, ContactOrderBy } from './contacts/contacts.enums'
import { ContactAddressType } from './contacts/address/address.enums'
import { ContactEmailType } from './contacts/email/email.enums'
import { ContactPhoneType } from './contacts/phone/phone.enums'
import { ContactSocialType } from './contacts/social/social.enums'

// DTOs
import { ContactDto, CreateContactDto, UpdateContactDto } from './contacts/contacts.dto'
import { ContactAddressDto } from './contacts/address/address.dto'
import { ContactEmailDto } from './contacts/email/email.dto'
import { ContactPhoneDto } from './contacts/phone/phone.dto'
import { ContactSocialDto } from './contacts/social/social.dto'
import { installCRMDocs } from './docs/install'

export {
	CrmModule,
	CrmCronsModule,
	ContactsModule,
	ContactsController,
	CRMCronsController,
	ContactsService,
	CrmCronsContactsService,
	ContactDto,
	CreateContactDto,
	UpdateContactDto,
	ContactSelect,
	ContactRelations,
	ContactOrderBy,
	ContactAddressDto,
	ContactEmailDto,
	ContactPhoneDto,
	ContactSocialDto,
	ContactSocial,
	ContactPhone,
	ContactEmail,
	Contact,
	ContactAddress,
	ContactSocialType,
	ContactPhoneType,
	ContactAddressType,
	ContactEmailType,
	installCRMDocs,
	ContactSocialService,
	ContactPhoneService,
	ContactEmailService,
	ContactAddressService,
}
