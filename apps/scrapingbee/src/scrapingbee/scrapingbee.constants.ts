import { Inject } from '@nestjs/common'

export const ScrapingbeeClientToken = Symbol('INJECT:SCRAPINGBEE:CLIENT')

export const InjectScrapingbee = () => Inject(ScrapingbeeClientToken)
