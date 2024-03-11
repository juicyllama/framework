import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Query } from '../../utils/typeorm/Query'
import { FxRate } from './fx.entity'
import { FxService } from './fx.service'

@Module({
	imports: [TypeOrmModule.forFeature([FxRate])],
	providers: [FxService, Logger, Query],
	exports: [FxService],
})
export class FxModule {}
