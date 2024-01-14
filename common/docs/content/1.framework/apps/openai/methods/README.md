# Methods

The following methods are available:

## Ask

```ts
// app.service.ts
import { OpenaiService } from '@juicyllama/app-openai'

@Injectable()
export class AppService {
	constructor(@Inject(forwardRef(() => OpenaiService)) private readonly openaiService: OpenaiService) {}

	async askAQuestion() {
		const request: CreateChatCompletionRequest = {
			model: 'text-davinci-003',
			prompt: 'Say this is a test',
			max_tokens: 7,
			temperature: 0,
		}
		const response = await this.openaiService.ask(request)

		// response = {
		// 	"id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
		// 	"object": "text_completion",
		// 	"created": 1589478378,
		// 	"model": "text-davinci-003",
		// 	"choices": [
		// 	{
		// 		"text": "\n\nThis is indeed a test",
		// 		"index": 0,
		// 		"logprobs": null,
		// 		"finish_reason": "length"
		// 	}
		// ],
		// 	"usage": {
		// 	"prompt_tokens": 5,
		// 		"completion_tokens": 7,
		// 		"total_tokens": 12
		// }
		// }
	}
}
```

## Ask

```ts
// app.service.ts
import { OpenaiService } from '@juicyllama/app-openai'

@Injectable()
export class AppService {
	constructor(@Inject(forwardRef(() => OpenaiService)) private readonly openaiService: OpenaiService) {}

	async getAnImage() {
		const request: CreateImageRequest = {
			prompt: 'A cute baby sea otter',
		}
		const response = await this.openaiService.ask(request)

		// response = {
		//  "created": 1589478378,
		//  "data": [
		// 	 {
		// 		 "url": "https://..."
		// 	 },
		// 	 {
		// 		 "url": "https://..."
		// 	 }
		//  ]
		// }
	}
}
```
