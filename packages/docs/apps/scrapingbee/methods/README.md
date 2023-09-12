# Methods

The following methods are available:

## Scrape

```typescript
// app.service.ts
import { ScrapingBeeService } from '@juicyllama/app-scrapingbee'

@Injectable()
export class AppService {
    constructor(
		@Inject(forwardRef(() => ScrapingBeeService)) private readonly scrapingBeeService: ScrapingBeeService,
    ) {}
    
    async scrape() {
        const data: ChatPostMessageArguments = {
			"url": "https://example.com",
		}
        const result = await this.scrapingBeeService.scrape(data)
        //do your thing with the result
    }
}
```