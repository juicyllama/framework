import { Body, Controller, forwardRef, Inject, Param, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
	AccountId,
	AccountService,
	AuthService,
	CreateDecorator,
	UpdateDecorator,
	UserAuth,
	UserRole,
} from '@juicyllama/core'
import { Query as JLQuery } from '@juicyllama/core'
import { E, T, NAME } from './shortlinks.constants.js'
import { ShortlinksService } from './shortlinks.service.js'
import { ShortenURLDto, UpdatShortenURLDto } from './shortlinks.dto.js'
import { ShortlinksShortenService } from './shortlinks.shorten.service.js'

const PRIMARY_KEY = 'shortlink_id'

@ApiTags('Shortlinks')
@UserAuth()
@Controller('/tools/shortlinks')
export class ShortlinksController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => ShortlinksService)) private readonly shortlinksService: ShortlinksService,
		@Inject(forwardRef(() => ShortlinksShortenService))
		private readonly shortlinksShortenService: ShortlinksShortenService,
		@Inject(forwardRef(() => JLQuery)) private readonly query: JLQuery<T>,
	) {}

	@CreateDecorator(E, NAME)
	async create(@Req() req, @Body() data: ShortenURLDto, @AccountId() account_id: number): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		const account = await this.accountService.findById(account_id)
		return await this.shortlinksShortenService.shortenUrl(data, account)
	}

	@UpdateDecorator(E, PRIMARY_KEY, NAME)
	async update(
		@Req() req,
		@AccountId() account_id: number,
		@Body() data: UpdatShortenURLDto,
		@Param() params,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await this.shortlinksService.update({
			[PRIMARY_KEY]: params[PRIMARY_KEY],
			...data,
		})
	}
}
