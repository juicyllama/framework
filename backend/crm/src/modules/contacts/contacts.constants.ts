import { ControllerConstants } from '@juicyllama/core'
import { ContactDto, ContactResponeDto, CreateContactDto, UpdateContactDto } from './contacts.dto'
import { Contact } from './contacts.entity'
import { ContactSelect, ContactOrderBy, ContactRelations } from './contacts.enums'

export const CRM_CONTACTS_E = Contact
export type CRM_CONTACTS_T = Contact
export const CRM_CONTACTS_PRIMARY_KEY = 'contact_id'
export const CRM_CONTACTS_NAME = 'contact'
export const CRM_CONTACTS_SEARCH_FIELDS = ['first_name', 'last_name']
export const CRM_CONTACTS_DEFAULT_ORDER_BY = 'first_name'

export const contactsConstants: ControllerConstants = {
	entity: CRM_CONTACTS_E,
	name: CRM_CONTACTS_NAME,
	primaryKey: CRM_CONTACTS_PRIMARY_KEY,
	searchFields: CRM_CONTACTS_SEARCH_FIELDS,
	defaultOrderBy: CRM_CONTACTS_DEFAULT_ORDER_BY,
	selectEnum: ContactSelect,
	orderByEnum: ContactOrderBy,
	relationsEnum: ContactRelations,
	dtos: {
		base: ContactDto,
		create: CreateContactDto,
		update: UpdateContactDto,
		response: ContactResponeDto,
	},
}
