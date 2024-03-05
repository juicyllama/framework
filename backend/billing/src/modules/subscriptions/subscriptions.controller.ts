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
import { Controller, Query, Inject, Req, forwardRef } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { billingRoles as roles } from '../billing.constants'
import { billingSubscriptionsConstants as constants, BILLING_SUBSCRIPTIONS_T as T } from './subscriptions.constants'
import { SubscriptionsService } from './subscriptions.service'

@ApiTags('Subscriptions')
@UserAuth()
@Controller('/billing/subscriptions')
export class SubscriptionsController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => SubscriptionsService)) readonly service: SubscriptionsService,
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
	async findAll(
		@Req() req: AuthenticatedRequest,
		@Query() query: any,
		@AccountId() account_id: number,
	): Promise<T[]> {
		return super.findAll(req, query, account_id)
	}
}
