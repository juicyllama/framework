# Getting Started

JuicyLlama maintain a centralised data cache of common data which can be shared across clients.

For example, rather than every single client who requires FX data interacting with 3rd party APIs and incuring costs. We maintain this centralised cache, improving speed, cost and ease of use.

::: warning
In order to use this data cache you will require an access key provided to you by the studio. Via this access key we can manage usage and charging.

Contact [studio@juicyllama.com](mailto:studio@juicyllama.com) to enquire about this service.
:::

## Install

Follow these instructions to use the Data Cache module in your project.

### Package

Install the package into your project:

```bash
pnpm install @juicyllama/data-cache
```

### API Key

Add your API key to the `.env` file

```dotenv
JUICYLLAMA_DATA_CACHE_API_KEY=YOUR_KEY
```

### Module

Import the module into your application:

```typescript
//app.module.ts
import { DataCacheModule } from '@juicyllama/data-cache'

@Module({
	imports: [
		forwardRef(() => DataCacheModule),
	],
})
```

### Service

Inject the service into your application passing the Entity you wish to use

```typescript
//app.service.ts
import { DataCacheService } from '@juicyllama/data-cache'

