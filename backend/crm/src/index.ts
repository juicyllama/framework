// Entities
export { Contact } from './modules/contacts/contacts.entity'
export { ContactAddress } from './modules/contacts/address/address.entity'
export { ContactEmail } from './modules/contacts/email/email.entity'
export { ContactPhone } from './modules/contacts/phone/phone.entity'
export { ContactSocial } from './modules/contacts/social/social.entity'

// Modules
export { CrmModule } from './crm.module'
export { CrmCronsModule } from './modules/contacts/crm.crons.module'
export { ContactsModule } from './modules/contacts/contacts.module'

// Controllers
export { ContactsController } from './modules/contacts/contacts.controller'
export { CRMCronsController } from './modules/contacts/crm.cron.controller'

// Services
export { ContactsService } from './modules/contacts/contacts.service'
export { CrmCronsContactsService } from './modules/contacts/crm.crons.contacts.service'
export { ContactAddressService } from './modules/contacts/address/address.service'
export { ContactEmailService } from './modules/contacts/email/email.service'
export { ContactPhoneService } from './modules/contacts/phone/phone.service'
export { ContactSocialService } from './modules/contacts/social/social.service'

// Enums
export { ContactSelect, ContactRelations, ContactOrderBy } from './modules/contacts/contacts.enums'
export { ContactAddressType } from './modules/contacts/address/address.enums'
export { ContactEmailType } from './modules/contacts/email/email.enums'
export { ContactPhoneType } from './modules/contacts/phone/phone.enums'
export { ContactSocialType } from './modules/contacts/social/social.enums'

// DTOs
export { ContactDto, CreateContactDto, UpdateContactDto } from './modules/contacts/contacts.dto'
export { ContactAddressDto } from './modules/contacts/address/address.dto'
export { ContactEmailDto } from './modules/contacts/email/email.dto'
export { ContactPhoneDto } from './modules/contacts/phone/phone.dto'
export { ContactSocialDto } from './modules/contacts/social/social.dto'
export { installCRMDocs } from './docs/install'