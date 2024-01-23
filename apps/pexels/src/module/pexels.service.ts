import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { createClient, ErrorResponse, PaginationParams, PhotosWithTotalResults } from 'pexels'

@Injectable()
export class PexelsService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Api)) private readonly api: Api,
	) {}

	async searchPhotos(
		options: PaginationParams & {
			query: string
		},
	): Promise<PhotosWithTotalResults | ErrorResponse> {
		const domain = 'app::pexels::image'
		const key = this.configService.get<string>('pexels.PEXELS_API_KEY');
		if (!key) {
			this.logger.error(`[${domain}] Error: PEXELS_API_KEY not found`)
			throw new Error('PEXELS_API_KEY not found')
		}
		try {
			const client = createClient(key)
			this.logger.debug(`[${domain}] Request: ${JSON.stringify(options, null, 2)}`)
			const result = await client.photos.search(options)
			if (typeof result === 'object' && 'error' in result) {
				throw new Error(result.error)
			}
			this.logger.debug(`[${domain}] Response: ${JSON.stringify(result, null, 2)}`)
			return result
		} catch (err) {
			const e = err as Error
			this.logger.warn(`[${domain}] Error: ${e.message}, Request: ${JSON.stringify(options, null, 2)}`, e)
			throw e
		}
	}
}
