import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'

@Injectable()
export class WiseService {
	constructor(@Inject(forwardRef(() => Logger)) private readonly logger: Logger) {}
}
