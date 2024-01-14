import { Controller, forwardRef, Inject, Query, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ChargesService } from './charges.service'
import {
	AccountId,
	AuthService,
	ReadManyDecorator,
	UserAuth,
	Query as TQuery,
	FxService,
	BaseController,
} from '@juicyllama/core'
import { billingChargesConstants as constants, BILLING_CHARGES_T as T } from './charges.constants'
import { billingRoles as roles } from '../billing.constants'

@ApiTags('Charges')
@UserAuth()
@Controller('/billing/charges')
export class ChargesController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => ChargesService)) readonly service: ChargesService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
		@Inject(forwardRef(() => FxService)) readonly fxService: FxService,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
				fxService,
			},
			roles: roles,
		})
	}

	@ReadManyDecorator(constants)
	async findAll(@Req() req, @Query() query: any, @AccountId() account_id: number): Promise<T[]> {
		return super.findAll(req, query, account_id)
	}
}
