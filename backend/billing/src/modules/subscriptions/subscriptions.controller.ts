import { Controller, forwardRef, Query, Inject, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SubscriptionsService } from './subscriptions.service'
import { AccountId, AuthService, BaseController, FxService, ReadManyDecorator, UserAuth } from '@juicyllama/core'
import { Query as TQuery } from '@juicyllama/core'
import { billingSubscriptionsConstants as constants, BILLING_SUBSCRIPTIONS_T as T } from './subscriptions.constants'
import { billingRoles as roles } from '../billing.constants'

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
	async findAll(@Req() req, @Query() query: any, @AccountId() account_id: number): Promise<T[]> {
		return super.findAll(req, query, account_id)
	}
}
