import { Controller, forwardRef, Inject, Query, Req } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { IsNull } from 'typeorm'
import { Charge } from './charges.entity'
import { ChargesService } from './charges.service'
import { AccountId, AuthService, ReadManyDecorator, UserAuth, UserRole } from '@juicyllama/core'
import { ChargeOrderBy, ChargeRelations, ChargeSelect } from './charges.enums'
import { Query as JLQuery } from '@juicyllama/core/dist/utils/typeorm/Query'
import { SupportedCurrencies } from '@juicyllama/utils'

const E = Charge
type T = Charge

@ApiTags('Charges')
@UserAuth()
@Controller('/billing/charges')
export class ChargesController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => ChargesService)) private readonly chargesService: ChargesService,
		@Inject(forwardRef(() => JLQuery)) private readonly query: JLQuery<T>,
	) {}

	@ReadManyDecorator(E, ChargeSelect, ChargeOrderBy, ChargeRelations)
	@ApiQuery({
		name: 'currency',
		description: 'The currency you are requesting data for',
		type: String,
		required: false,
		example: SupportedCurrencies.USD,
	})
	async listAll(@Req() req, @AccountId() account_id: number, @Query() query): Promise<T[]> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])

		const where = {
			account: { account_id: account_id },
			deleted_at: IsNull(),
			currency: query.currency ?? null,
		}

		return await this.chargesService.findAll(this.query.findOptions(query, where))
	}
}
