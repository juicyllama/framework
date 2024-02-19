import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Patch,
	Get,
	Req,
	forwardRef,
	Inject,
	Query,
	Delete,
} from '@nestjs/common'
import { ApiQuery, ApiParam, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AccountId, CreateDecorator, UserAuth } from '../../decorators'
import { AuthenticatedRequest } from '../../types/authenticated-request.interface'
import { SETTINGS_E, SETTINGS_T, SETTINGS_NAME } from './settings.constants'
import { CreateSettingsDto, UpdateSettingsDto } from './settings.dto'
import { SettingsService } from './settings.service'

@ApiTags('Settings')
@UserAuth()
@Controller(`/settings`)
export class SettingsController {
	constructor(@Inject(forwardRef(() => SettingsService)) private readonly service: SettingsService) {}

	//use new extends BaseController<SETTINGS_T> to replace this
	@CreateDecorator({ entity: SETTINGS_E, name: SETTINGS_NAME })
	async create(@AccountId() account_id: number, @Body() data: CreateSettingsDto): Promise<SETTINGS_T> {
		return await this.service.create(data.key, data.value, account_id, data.user_id)
	}

	@ApiOperation({ summary: `Get Setting Value` })
	@ApiParam({
		name: 'key',
		description: `The key for the value you wish to return`,
		type: String,
		required: true,
		example: 'something::unique::key',
	})
	@ApiQuery({
		name: 'user_id',
		description: `The user_id for the setting if assigned to a specific user`,
		type: Number,
		required: false,
		example: 1,
	})
	@Get(':key')
	async findValueByKey(
		@AccountId() account_id: number,
		@Param('key') key: string,
		@Query('user_id') user_id: number,
	): Promise<any> {
		const setting = await this.service.findOne(key)

		if (!setting) {
			throw new BadRequestException(`Setting with key: ${key} not found`)
		}

		if (setting.user_id && setting.user_id !== user_id) {
			throw new BadRequestException(`Setting with key: ${key} not found`)
		}

		if (setting.account_id && setting.account_id !== account_id) {
			throw new BadRequestException(`Setting with key: ${key} not found`)
		}

		return setting.value
	}

	@ApiOperation({ summary: `Update Setting Value` })
	@ApiParam({
		name: 'key',
		description: `The key for the value you wish to update`,
		type: String,
		required: true,
		example: 'something::unique::key',
	})
	@Patch(':key')
	async update(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Body() data: UpdateSettingsDto,
		@Param('key') key: string,
	): Promise<SETTINGS_T> {
		const setting = await this.service.findOne(key)

		if (!setting) {
			throw new BadRequestException(`Setting with key: ${key} not found`)
		}

		if (setting.user_id && setting.user_id !== req.user.user_id) {
			throw new BadRequestException(`Setting with key: ${key} not found`)
		}

		if (setting.account_id && setting.account_id !== account_id) {
			throw new BadRequestException(`Setting with key: ${key} not found`)
		}

		return await this.service.update(key, data.value)
	}

	@ApiOperation({ summary: `Delete Setting` })
	@ApiParam({
		name: 'key',
		description: `The key for the value you wish to delete`,
		type: String,
		required: true,
		example: 'something::unique::key',
	})
	@Delete(':key')
	async delete(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('key') key: string,
	): Promise<SETTINGS_T> {
		const setting = await this.service.findOne(key)

		if (!setting) {
			throw new BadRequestException(`Setting with key: ${key} not found`)
		}

		if (setting.user_id && setting.user_id !== req.user.user_id) {
			throw new BadRequestException(`Setting with key: ${key} not found`)
		}

		if (setting.account_id && setting.account_id !== account_id) {
			throw new BadRequestException(`Setting with key: ${key} not found`)
		}

		await this.service.purge(setting)
		return setting
	}
}
