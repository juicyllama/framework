import { AuthModule, databaseConfig, FxModule, jwtConfig, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ChargesController } from './charges.controller'
import { Charge } from './charges.entity'
import { ChargesService } from './charges.service'
import { ChargesSubscriber } from './charges.subscriber'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Charge]),
		AuthModule,
		FxModule,
	],
	controllers: [ChargesController],
	providers: [ChargesService, ChargesSubscriber, Logger, Query],
	exports: [ChargesService],
})
export class ChargesModule {}
