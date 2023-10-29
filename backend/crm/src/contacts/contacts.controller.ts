import {
	BadRequestException,
	Body,
	Controller,
	forwardRef,
	Inject,
	Param,
	Patch,
	Query,
	Req,
	UploadedFile,
} from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { isNil, omitBy } from 'lodash'
import { Logger, StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { isEmail } from 'class-validator'
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere'
import { Express } from 'express'
import { ContactsService } from './contacts.service'
import {
	Query as TQuery,
	AccountId,
	AccountService,
	AuthService,
	CreateDecorator,
	crudDelete,
	crudFindAll,
	crudFindOne,
	crudStats,
	crudUpdate,
	DeleteDecorator,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	TagsService,
	UpdateDecorator,
	UploadFileDecorator,
	UserAuth,
	UsersService,
} from '@juicyllama/core'
import { DeepPartial, In, Like } from 'typeorm'
import { Contact } from './contacts.entity'
import { CreateContactDto, UpdateContactDto } from './contacts.dto'
import { Tag } from '@juicyllama/core/dist/modules/tags/tags.entity'
import { ContactOrderBy, ContactRelations, ContactSelect } from './contacts.enums'
import { ContactHasPhoneFilter, ContactPhoneType } from './phone/phone.enums'
import { ContactEmailType, ContactHasEmailFilter } from './email/email.enums'

const E = Contact
type T = Contact
const PRIMARY_KEY = 'contact_id'
const NAME = 'contact'
const SEARCH_FIELDS = ['first_name', 'last_name']
const DEFAULT_ORDER_BY = 'first_name'

@ApiTags('Contacts')
@UserAuth()
@Controller('crm/contacts')
export class ContactsController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => ContactsService)) private readonly service: ContactsService,
		@Inject(forwardRef(() => TagsService)) private readonly tagsService: TagsService,
		@Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<T>,
	) {}

	@CreateDecorator({ entity: E, name: NAME })
	async create(@Req() req, @Body() data: CreateContactDto, @AccountId() account_id: number): Promise<T> {
		const domain = 'crm::contacts::controller::create'

		this.logger.log(`[${domain}] Creating contact`, data)

		const user = await this.usersService.findById(req.user.user_id)
		const account = await this.accountService.findById(account_id)

		const tags: Tag[] = []

		if (data.tags) {
			for (const tag of data.tags) {
				tags.push(await this.tagsService.create(tag))
			}
		}

		const contact = <DeepPartial<T>>{
			...data,
			account_id: account.account_id,
			tags: tags,
			added_by: user,
		}

		return await this.service.create(contact)
	}

	@ReadManyDecorator({
		entity: E,
		selectEnum: ContactSelect,
		orderByEnum: ContactOrderBy,
		relationsEnum: ContactRelations,
	})
	@ApiQuery({ name: 'has_email', enum: ContactHasEmailFilter, required: false })
	@ApiQuery({ name: 'has_phone', enum: ContactHasPhoneFilter, required: false })
	async findAll(@Query() query, @AccountId() account_id: number): Promise<T[]> {
		return await crudFindAll<T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: SEARCH_FIELDS,
			order_by: DEFAULT_ORDER_BY,
		})
	}

	@ReadStatsDecorator({ name: NAME })
	async stats(
		@Query() query,
		@AccountId() account_id: number,
		@Query('method') method: StatsMethods,
	): Promise<StatsResponseDto> {
		return await crudStats<T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			method: method,
			searchFields: SEARCH_FIELDS,
		})
	}

	@ReadOneDecorator({
		entity: E,
		primaryKey: PRIMARY_KEY,
		selectEnum: ContactSelect,
		relationsEnum: ContactRelations,
	})
	async findOne(@AccountId() account_id: number, @Param() params, @Query() query): Promise<T> {
		return await crudFindOne<T>({
			service: this.service,
			query: query,
			primaryKey: params[PRIMARY_KEY],
			account_id: account_id,
		})
	}

	@UpdateDecorator({ entity: E, primaryKey: PRIMARY_KEY, name: NAME })
	async update(@AccountId() account_id: number, @Body() data: UpdateContactDto, @Param() params): Promise<T> {
		const domain = 'crm::contacts::controller::update'

		this.logger.log(`[${domain}] Updating contact`, data)

		const contact = await this.service.findOne({
			where: {
				[PRIMARY_KEY]: params[PRIMARY_KEY],
				account: {
					account_id: account_id,
				},
			},
		})

		if (!contact) {
			throw new BadRequestException(`Contact #${params[PRIMARY_KEY]} not found`)
		}

		return await crudUpdate<T>({
			service: this.service,
			data: data,
			primaryKey: params[PRIMARY_KEY],
		})
	}

	//todo add tag
	//todo remove tag

	@ApiOperation({ summary: 'Upload Contact Avatar', description: 'Upload Avatar Image File' })
	@UploadFileDecorator({ entity: E })
	@Patch(':contact_id/avatar')
	async uploadAvatarFile(
		@Req() req,
		@UploadedFile()
		file: Express.Multer.File,
		@Param('contact_id') contact_id: number,
		@AccountId() account_id: number,
	): Promise<Contact> {
		if (!file) {
			throw new BadRequestException(`Missing required field: file`)
		}

		if (!Boolean(file.mimetype.match(/(jpg|jpeg|png|gif)/))) {
			throw new BadRequestException(`Not a valid jpg|jpeg|png|gif file`)
		}

		await this.authService.check(req.user.user_id, account_id)

		const contact: Contact = await this.service.findOne({
			where: {
				contact_id: req.contact.contact_id,
				account: {
					account_id: account_id,
				},
			},
		})
		await this.service.uploadAvatar(contact, file)
		return await this.service.findById(contact_id)
	}

	@DeleteDecorator({ entity: E, primaryKey: PRIMARY_KEY, name: NAME })
	async remove(@Param() params, @AccountId() account_id: number): Promise<T> {
		return await crudDelete<T>({
			service: this.service,
			primaryKey: params[PRIMARY_KEY],
			account_id: account_id,
		})
	}

	processQuery(query: any, account_id: number): FindOptionsWhere<Contact>[] {
		let where: FindOptionsWhere<Contact>[] = [
			omitBy(
				{
					account: {
						account_id: In([account_id]),
					},
					emails: query.has_email
						? {
								type:
									query.has_email === ContactHasEmailFilter.ANY
										? In([ContactEmailType.PERSONAL, ContactEmailType.WORK, ContactEmailType.OTHER])
										: In([query.has_email]),
						  }
						: null,
					phones: query.has_phone
						? {
								type:
									query.has_phone === ContactHasPhoneFilter.ANY
										? In([
												ContactPhoneType.MOBILE,
												ContactPhoneType.LANDLINE,
												ContactPhoneType.OTHER,
										  ])
										: In([query.has_phone]),
						  }
						: null,
				},
				isNil,
			),
		]

		if (query.search) {
			if (isEmail(query.search)) {
				where = [
					omitBy(
						{
							account: {
								account_id: In([account_id]),
							},
							emails: omitBy(
								{
									email: Like(query.search),
									type: query.has_email
										? query.has_email === ContactHasEmailFilter.ANY
											? In([
													ContactEmailType.PERSONAL,
													ContactEmailType.WORK,
													ContactEmailType.OTHER,
											  ])
											: In([query.has_email])
										: null,
								},
								isNil,
							),
							phones: query.has_phone
								? {
										type:
											query.has_phone === ContactHasPhoneFilter.ANY
												? In([
														ContactPhoneType.MOBILE,
														ContactPhoneType.LANDLINE,
														ContactPhoneType.OTHER,
												  ])
												: In([query.has_phone]),
								  }
								: null,
						},
						isNil,
					),
				]
			} else {
				where = [
					omitBy(
						{
							account: {
								account_id: In([account_id]),
							},
							first_name: Like(`%${query.search}%`),
							emails: query.has_email
								? {
										type:
											query.has_email === ContactHasEmailFilter.ANY
												? In([
														ContactEmailType.PERSONAL,
														ContactEmailType.WORK,
														ContactEmailType.OTHER,
												  ])
												: In([query.has_email]),
								  }
								: null,
							phones: query.has_phone
								? {
										type:
											query.has_phone === ContactHasPhoneFilter.ANY
												? In([
														ContactPhoneType.MOBILE,
														ContactPhoneType.LANDLINE,
														ContactPhoneType.OTHER,
												  ])
												: In([query.has_phone]),
								  }
								: null,
						},
						isNil,
					),
					omitBy(
						{
							account: {
								account_id: In([account_id]),
							},
							last_name: Like(`%${query.search}%`),
							emails: query.has_email
								? {
										type:
											query.has_email === ContactHasEmailFilter.ANY
												? In([
														ContactEmailType.PERSONAL,
														ContactEmailType.WORK,
														ContactEmailType.OTHER,
												  ])
												: In([query.has_email]),
								  }
								: null,
							phones: query.has_phone
								? {
										type:
											query.has_phone === ContactHasPhoneFilter.ANY
												? In([
														ContactPhoneType.MOBILE,
														ContactPhoneType.LANDLINE,
														ContactPhoneType.OTHER,
												  ])
												: In([query.has_phone]),
								  }
								: null,
						},
						isNil,
					),
					omitBy(
						{
							account: {
								account_id: In([account_id]),
							},
							emails: omitBy(
								{
									email: Like(`%${query.search}%`),
									type: query.has_email
										? query.has_email === ContactHasEmailFilter.ANY
											? In([
													ContactEmailType.PERSONAL,
													ContactEmailType.WORK,
													ContactEmailType.OTHER,
											  ])
											: In([query.has_email])
										: null,
								},
								isNil,
							),
							phones: query.has_phone
								? {
										type:
											query.has_phone === ContactHasPhoneFilter.ANY
												? In([
														ContactPhoneType.MOBILE,
														ContactPhoneType.LANDLINE,
														ContactPhoneType.OTHER,
												  ])
												: In([query.has_phone]),
								  }
								: null,
						},
						isNil,
					),
					omitBy(
						{
							account: {
								account_id: In([account_id]),
							},
							phones: omitBy(
								{
									number: Like(`%${query.search}%`),
									type: query.has_phone
										? query.has_phone === ContactHasPhoneFilter.ANY
											? In([
													ContactPhoneType.MOBILE,
													ContactPhoneType.LANDLINE,
													ContactPhoneType.OTHER,
											  ])
											: In([query.has_phone])
										: null,
								},
								isNil,
							),
							emails: query.has_email
								? {
										type:
											query.has_email === ContactHasEmailFilter.ANY
												? In([
														ContactEmailType.PERSONAL,
														ContactEmailType.WORK,
														ContactEmailType.OTHER,
												  ])
												: In([query.has_email]),
								  }
								: null,
						},
						isNil,
					),
				]
			}
		}

		return where
	}
}
