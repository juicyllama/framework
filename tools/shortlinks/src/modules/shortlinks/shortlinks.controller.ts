import { Body, Controller, forwardRef, Inject, Param, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AccountId, AccountService, AuthService, CreateDecorator, UpdateDecorator, UserAuth } from '@juicyllama/core'
import { Query as JLQuery } from '@juicyllama/core/dist/utils/typeorm/Query'
import { E, T, NAME } from './shortlinks.constants'
import { ShortlinksService } from './shortlinks.service'
import { ShortenURLDto, UpdatShortenURLDto } from './shortlinks.dto'

const PRIMARY_KEY = 'shortlink_id'

@ApiTags('Shortlinks')
@UserAuth()
@Controller('/tools/shortlinks')
export class ShortlinksController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => ShortlinksService)) private readonly service: ShortlinksService,
		@Inject(forwardRef(() => JLQuery)) private readonly query: JLQuery<T>,
	) {}

	@CreateDecorator({ entity: E, name: NAME })
	async create(@Req() req, @Body() data: ShortenURLDto, @AccountId() account_id: number): Promise<T> {
		const account = await this.accountService.findById(account_id)
		return await this.service.shortenUrl(data, account)
	}

	@UpdateDecorator({ entity: E, primaryKey: PRIMARY_KEY, name: NAME })
	async update(
		@Req() req,
		@AccountId() account_id: number,
		@Body() data: UpdatShortenURLDto,
		@Param() params: any,
	): Promise<T> {
		return await this.service.update({
			[PRIMARY_KEY]: params[PRIMARY_KEY],
			...data,
		})
	}
}
