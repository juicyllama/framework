// Entities
import { Contact } from './modules/contacts/contacts.entity'
import { ContactAddress } from './modules/contacts/address/address.entity'
import { ContactEmail } from './modules/contacts/email/email.entity'
import { ContactPhone } from './modules/contacts/phone/phone.entity'
import { ContactSocial } from './modules/contacts/social/social.entity'

// Modules
import { CrmModule } from './crm.module'
import { CrmCronsModule } from './modules/contacts/crm.crons.module'
import { ContactsModule } from './modules/contacts/contacts.module'

// Controllers
import { ContactsController } from './modules/contacts/contacts.controller'
import { CRMCronsController } from './modules/contacts/crm.cron.controller'

// Services
import { ContactsService } from './modules/contacts/contacts.service'
import { CrmCronsContactsService } from './modules/contacts/crm.crons.contacts.service'
import { ContactAddressService } from './modules/contacts/address/address.service'
import { ContactEmailService } from './modules/contacts/email/email.service'
import { ContactPhoneService } from './modules/contacts/phone/phone.service'
import { ContactSocialService } from './modules/contacts/social/social.service'

// Enums
import { ContactSelect, ContactRelations, ContactOrderBy } from './modules/contacts/contacts.enums'
import { ContactAddressType } from './modules/contacts/address/address.enums'
import { ContactEmailType } from './modules/contacts/email/email.enums'
import { ContactPhoneType } from './modules/contacts/phone/phone.enums'
import { ContactSocialType } from './modules/contacts/social/social.enums'

// DTOs
import { ContactDto, CreateContactDto, UpdateContactDto } from './modules/contacts/contacts.dto'
import { ContactAddressDto } from './modules/contacts/address/address.dto'
import { ContactEmailDto } from './modules/contacts/email/email.dto'
import { ContactPhoneDto } from './modules/contacts/phone/phone.dto'
import { ContactSocialDto } from './modules/contacts/social/social.dto'
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
