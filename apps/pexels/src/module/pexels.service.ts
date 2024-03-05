import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { createClient, ErrorResponse, PaginationParams, PhotosWithTotalResults } from 'pexels'
import { InjectPexels } from './pexels.constants'

@Injectable()
export class PexelsService {
	constructor(
		private readonly logger: Logger,
		@InjectPexels() private readonly client: ReturnType<typeof createClient>,
	) {}

	async searchPhotos(
		options: PaginationParams & {
			query: string
		},
	): Promise<PhotosWithTotalResults | ErrorResponse> {
		const domain = 'app::pexels::image'
		try {
			this.logger.debug(`[${domain}] Request: ${JSON.stringify(options, null, 2)}`)
			const result = await this.client.photos.search(options)
			this.logger.debug(`[${domain}] Response: ${JSON.stringify(result, null, 2)}`)
			return result
		} catch (err) {
			const e = err as Error
			this.logger.warn(`[${domain}] Error: ${e.message}, Request: ${JSON.stringify(options, null, 2)}`, e)
			throw e
		}
	}
}
