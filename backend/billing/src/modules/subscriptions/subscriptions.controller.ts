import { Controller, forwardRef, Query, Inject, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { IsNull } from 'typeorm'
import { Subscription } from './subscriptions.entity'
import { SubscriptionsService } from './subscriptions.service'
import { AccountId, AuthService, ReadManyDecorator, UserAuth, UserRole } from '@juicyllama/core'
import { Query as JLQuery } from '@juicyllama/core'
import { SubscriptionOrderBy, SubscriptionRelations, SubscriptionSelect } from './subscriptions.enums'

const E = Subscription
type T = Subscription

@ApiTags('Subscriptions')
@UserAuth()
@Controller('/billing/subscriptions')
export class SubscriptionsController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => SubscriptionsService)) private readonly subscriptionsService: SubscriptionsService,
		@Inject(forwardRef(() => JLQuery)) private readonly query: JLQuery<T>,
	) {}

	@ReadManyDecorator({
		entity: E,
		selectEnum: SubscriptionSelect,
		orderByEnum: SubscriptionOrderBy,
		relationsEnum: SubscriptionRelations,
	})
	async listAll(@Req() req, @AccountId() account_id: number, @Query() query): Promise<T[]> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])

		const where = {
			account: { account_id: account_id },
			deleted_at: IsNull(),
		}

		return await this.subscriptionsService.findAll(this.query.findOptions(query, where))
	}
}
