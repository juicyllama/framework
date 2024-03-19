import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { WebsocketGateway } from './websocket.gateway'
import { WebsocketService } from './websocket.service'

@Module({
	providers: [Logger, WebsocketGateway, WebsocketService],
	exports: [WebsocketService],
})
export class WebsocketModule {}
