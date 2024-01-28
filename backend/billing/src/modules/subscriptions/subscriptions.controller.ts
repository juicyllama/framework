import {
	AccountId,
	AuthService,
	AuthenticatedRequest,
	BaseController,
	FxService,
	Query as TQuery,
	ReadManyDecorator,
	UserAuth,
} from '@juicyllama/core'
import { Controller, Query, Inject, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { billingRoles as roles } from '../billing.constants'
import { billingSubscriptionsConstants as constants, BILLING_SUBSCRIPTIONS_T as T } from './subscriptions.constants'
import { SubscriptionsService } from './subscriptions.service'

@ApiTags('Subscriptions')
@UserAuth()
@Controller('/billing/subscriptions')
export class SubscriptionsController extends BaseController<T> {
	constructor(
		readonly authService: AuthService,
		readonly service: SubscriptionsService,
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
