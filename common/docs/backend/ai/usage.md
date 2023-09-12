# Usage

## Endpoints

Once you have [installed](/backend/ai#install) the Ai package, new endpoint will be available in your project.

Documentation will also be added to your project for full details on each endpoint.

### Chat

The chat endpoint allows you to interact with the AI in a chat like manner.

```typescript
//app.service.js
import { AiService } from '@juicyllama/ai'

@Injectable()
export class AppService {
	constructor(
		private readonly aiService: AiService,
	) {}

    async chat(question: string){
		const openaiOptions: CreateChatCompletionRequest = {
			model: "text-davinci-003",
        }
		
		const result = await this.aiService.chat({
			question: question,
			openaiOptions: openaiOptions
	    })
        
        if(result.success === AiSuccessType.SUCCESS){
			return result.response
        }else{
			throw new Error(`[${result.success}] ${result.error_message}`)
		}
	}
    
}
```

### Image

The image endpoint allows you to interact with the AI to generate an image.

```typescript
//app.service.js
import { AiService } from '@juicyllama/ai'

@Injectable()
export class AppService {
	constructor(
		private readonly aiService: AiService,
	) {}

    async image(image_description: string){
		const openaiOptions: CreateImageRequest = {
		}
		
		const result = await this.aiService.image({
			image_description: image_description,
			openaiOptions: openaiOptions
	    })
        
        if(result.success === AiSuccessType.SUCCESS){
			return result.response
        }else{
			throw new Error(`[${result.success}] ${result.error_message}`)
		}
	}
    
}
```