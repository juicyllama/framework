# Methods

The following methods are available:

## Message

```ts
// app.service.ts
import { SlackService } from '@juicyllama/app-slack'

@Injectable()
export class AppService {
	constructor(@Inject(forwardRef(() => SlackService)) private readonly slackService: SlackService) {}

	async sendMessage() {
		const message: ChatPostMessageArguments = {
			channel: 'example',
			text: 'TESTING...1...2...3',
		}
		await this.slackService.sendMessage(message)
	}
}
```
