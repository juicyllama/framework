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
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ChartsPeriod, ChartsResponseDto, StatsMethods } from '@juicyllama/utils'
import { Express } from 'express'
import { ContactsService } from './contacts.service'
import {
	Query as TQuery,
	AccountId,
	AuthService,
	CreateDecorator,
	DeleteDecorator,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	TagsService,
	UpdateDecorator,
	UploadFileDecorator,
	UserAuth,
	UsersService,
	BaseController,
	ReadChartsDecorator,
	BulkUploadDecorator,
	BulkUploadDto,
	BulkUploadResponse,
	UploadFieldsDecorator,
	CrudUploadFieldsResponse,
} from '@juicyllama/core'
import { Contact } from './contacts.entity'
import { Tag } from '@juicyllama/core/dist/modules/tags/tags.entity'
import { contactsConstants as constants, CRM_CONTACTS_T as T, CRM_CONTACTS_E as E } from './contacts.constants'
import { CreateContactDto as CreateDto, UpdateContactDto as UpdateDto } from './contacts.dto'

@ApiTags('Contacts')
@UserAuth()
@Controller('crm/contacts')
export class ContactsController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => ContactsService)) readonly service: ContactsService,
		@Inject(forwardRef(() => TagsService)) readonly tagsService: TagsService,
		@Inject(forwardRef(() => UsersService)) readonly usersService: UsersService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
			},
		})
	}

	@CreateDecorator(constants)
	async create(@Req() req, @Body() body: CreateDto, @AccountId() account_id: number): Promise<T> {
		const tags: Tag[] = []

		if (body.tags) {
			for (const tag of body.tags) {
				tags.push(await this.tagsService.create(tag))
			}
		}

		return super.create(
			req,
			{
				...body,
				tags: tags,
			},
			account_id,
		)
	}

	@ReadManyDecorator(constants)
	async findAll(@Req() req, @Query() query, @AccountId() account_id: number): Promise<T[]> {
		return super.findAll(req, query, account_id)
	}

	@ReadStatsDecorator(constants)
	async stats(
		@Req() req,
		@Query() query,
		@AccountId() account_id: number,
		@Query('method') method: StatsMethods,
	): Promise<any> {
		return super.stats(req, query, account_id, method)
	}

	@ReadChartsDecorator(constants)
	async charts(
		@Req() req,
		@AccountId() account_id: number,
		@Query() query: any,
		@Query('search') search: string,
		@Query('from') from: string,
		@Query('to') to: string,
		@Query('fields') fields: string[],
		@Query('period') period?: ChartsPeriod,
	): Promise<ChartsResponseDto> {
		return super.charts(req, account_id, query, search, from, to, fields, period)
	}

	@ReadOneDecorator(constants)
	async findOne(@Req() req, @AccountId() account_id: number, @Param() params, @Query() query): Promise<T> {
		return super.findOne(req, account_id, params, query)
	}

	@UpdateDecorator(constants)
	async update(@Req() req, @AccountId() account_id: number, @Body() data: UpdateDto, @Param() params): Promise<T> {
		return super.update(req, account_id, data, params)
	}

	@BulkUploadDecorator(constants)
	async bulkUpload(
		@Req() req,
		@Body() body: BulkUploadDto,
		@AccountId() account_id: number,
		@UploadedFile() file?: Express.Multer.File,
	): Promise<BulkUploadResponse> {
		return super.bulkUpload(req, body, account_id, file)
	}

	@UploadFieldsDecorator(constants)
	async uploadFileFields(): Promise<CrudUploadFieldsResponse> {
		return super.uploadFileFields()
	}

	@DeleteDecorator(constants)
	async remove(@Req() req, @Param() params, @AccountId() account_id: number): Promise<T> {
		return super.remove(req, params, account_id)
	}

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
}
