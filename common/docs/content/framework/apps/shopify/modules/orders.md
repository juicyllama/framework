# Orders

Import the module into your project:

```ts
// app.module.ts
import { ShopifyOrdersModule } from '@juicyllama/app-shopify'

@Module({
	imports: [ShopifyOrdersModule],
})
export class AppModule {}
```

### Services

- [List Orders](https://github.com/juicyllama/framework/blob/main/apps/shopify/src/modules/orders/orders.service.ts#L26){:target="_blank"}


### Webhooks

- `app/shopify/orders/webhook` - [Code](https://github.com/juicyllama/framework/blob/main/apps/shopify/src/modules/orders/orders.controller.ts#L105){:target="_blank"}