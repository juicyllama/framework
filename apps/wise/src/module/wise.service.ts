import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'

@Injectable()
export class WiseService {
	constructor(private readonly logger: Logger) {}
}
