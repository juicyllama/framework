import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Setting } from './settings.entity'
import { Cache } from 'cache-manager'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { CachePeriod, Env, JLCache, Logger } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query'

const cache_key = 'utils::settings'

@Injectable()
export class SettingsService {
	constructor(
		@Inject(forwardRef(() => Query)) private readonly query: Query<Setting>,
		@InjectRepository(Setting) private readonly repository: Repository<Setting>,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		@Inject(Logger) private logger: Logger,
	) {}

	async create(key: string, value: any, account_id?: number, user_id?: number): Promise<Setting> {
		if (!SettingsService.validate(value)) {
			this.logger.error('Value must be an object')
			throw new Error('Value must be an object')
		}

		let setting = await this.findOne(key)

		if (setting) {
			return await this.update(key, value)
		}

		setting = await this.query.create(this.repository, {
			key: key,
			value: value,
			account_id: account_id,
			user_id: user_id,
		})

		await this.cacheManager.set(JLCache.cacheKey(cache_key, key), setting, CachePeriod.MONTH)

		return setting
	}

	async findOne(key: string): Promise<Setting | null> {
		let setting: Setting | null = <Setting>await this.cacheManager.get(JLCache.cacheKey(cache_key, key))

		if (setting) return setting

		setting = await this.repository.findOne({
			where: { key: key },
		})

		if (setting) {
			await this.cacheManager.set(JLCache.cacheKey(cache_key, key), setting, CachePeriod.MONTH)
		}

		return setting
	}

	async findAll(options?: FindManyOptions): Promise<Setting[]> {
		return await this.query.findAll(this.repository, options)
	}

	async findValue(key: string): Promise<any> {
		const result = await this.findOne(key)
		if (result && result.value) {
			return result.value
		}
	}

	async update(key: string, value: any): Promise<Setting> {
		if (!SettingsService.validate(value)) {
			this.logger.error('Value must be an object')
			throw new Error('Value must be an object')
		}

		const setting = await this.findOne(key)

		if (!setting) {
			return await this.create(key, value)
		}

		await this.repository.update(setting.id, {
			value: value,
		})

		setting.value = value

		await this.cacheManager.set(JLCache.cacheKey(cache_key, key), setting, CachePeriod.MONTH)

		return setting
	}

	async purge(setting: Setting): Promise<void> {
		await this.cacheManager.del(JLCache.cacheKey(cache_key, setting.key))
		return await this.query.purge(this.repository, setting)
	}

	/**
	 * Check if the cron is already running
	 * @param domain
	 * @param time
	 */
	async cronCheck(domain: string, time: CachePeriod): Promise<boolean> {
		//skip check if not production
		if (!Env.IsProd()) {
			return true
		}

		const setting = await this.findValue(domain)

		if (setting && setting.running === true && new Date(setting.next_run_override) > new Date()) {
			this.logger.warn(`[${domain}] Previous job still running`)
			return false
		}

		const next_run_override = new Date()
		next_run_override.setMinutes(next_run_override.getMinutes() + time)

		await this.update(domain, {
			running: true,
			next_run_override: next_run_override,
		})

		return true
	}

	/**
	 * Informs the settings service the cron is ready to go again
	 * @param domain
	 */
	async cronEnd(domain: string): Promise<void> {
		await this.update(domain, {
			running: false,
			next_run_override: new Date(),
		})
	}

	static validate(value: any): boolean {
		return value instanceof Object
	}
}
