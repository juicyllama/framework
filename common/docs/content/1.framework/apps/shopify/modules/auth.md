# Auth

Import the module into your project:

```ts
// app.module.ts
import { ShopifyAuthModule } from '@juicyllama/app-shopify'

@Module({
	imports: [ShopifyAuthModule],
})
export class AppModule {}
```

This will expose the relevent Oauth2 endpoints