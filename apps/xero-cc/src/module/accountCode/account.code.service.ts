import { BaseService, Query, Tag } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { XeroAccountCode } from './account.code.entity'

type T = XeroAccountCode

@Injectable()
export class AccountCodeService extends BaseService<T> {
	constructor(
		readonly query: Query<T>,
		@InjectRepository(XeroAccountCode) readonly repository: Repository<T>,
		readonly logger: Logger,
	) {
		super(query, repository)
	}

	async getAccountCodeByTag(tag: Tag): Promise<string> {
		const domain = 'app::xero::AccountCodeService::getAccountCodeByTag'

		this.logger.debug(`[${domain}] Getting account code for tag #${tag.tag_id}`, tag)

		const result = await super.findOne({
			where: {
				tag: {
					tag_id: tag.tag_id,
				},
			},
		})

		if (result?.account_code) {
			this.logger.debug(`[${domain}] Found account code ${result.account_code} for tag #${tag.tag_id}`, result)
			return result.account_code
		}

		this.logger.debug(
			`[${domain}] No account code found for tag #${tag.tag_id}, returning ${process.env.XERO_CC_DEFAULT_ACCOUNT_CODE}`,
		)
		return process.env.XERO_CC_DEFAULT_ACCOUNT_CODE
	}

	async getTaxTypeByTag(tag: Tag): Promise<string> {
		const domain = 'app::xero::AccountCodeService::getTaxTypeByTag'

		this.logger.debug(`[${domain}] Getting tax type for tag #${tag.tag_id}`, tag)

		const result = await super.findOne({
			where: {
				tag: {
					tag_id: tag.tag_id,
				},
			},
		})

		if (result?.tax_type) {
			this.logger.debug(`[${domain}] Found tax type ${result.tax_type} for tag #${tag.tag_id}`, result)
			return result.tax_type
		}

		this.logger.debug(`[${domain}] No tax type found for tag #${tag.tag_id}, returning NONE`)
		return 'NONE'
	}
}
