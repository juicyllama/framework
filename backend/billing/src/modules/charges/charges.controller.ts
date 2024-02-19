import {
	AccountId,
	AuthService,
	ReadManyDecorator,
	UserAuth,
	Query as TQuery,
	FxService,
	BaseController,
	AuthenticatedRequest,
} from '@juicyllama/core'
import { Controller, Inject, Query, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { billingRoles as roles } from '../billing.constants'
import { billingChargesConstants as constants, BILLING_CHARGES_T as T } from './charges.constants'
import { ChargesService } from './charges.service'

@ApiTags('Charges')
@UserAuth()
@Controller('/billing/charges')
export class ChargesController extends BaseController<T> {
	constructor(
		readonly authService: AuthService,
		readonly service: ChargesService,
		@Inject(TQuery) readonly tQuery: TQuery<T>,
		readonly fxService: FxService,
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
	async findAll(
		@Req() req: AuthenticatedRequest,
		@Query() query: any,
		@AccountId() account_id: number,
	): Promise<T[]> {
		return super.findAll(req, query, account_id)
	}
}
