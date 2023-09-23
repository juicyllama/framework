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

		try {
			const client = createClient(this.configService.get<string>('pexels.PEXELS_API_KEY'))
			this.logger.debug(`[${domain}] Request: ${JSON.stringify(options, null, 2)}`)
			const result = await client.photos.search(options)
			this.logger.debug(`[${domain}] Response: ${JSON.stringify(result, null, 2)}`)
			return result
		} catch (e: any) {
			this.logger.warn(`[${domain}] Error: ${JSON.stringify(e.message, null, 2)}`, e.response)
		}
	}
}
