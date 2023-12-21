import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'

@Injectable()
export class WiseBalanceService {
	constructor(private readonly logger: Logger) {}
}
