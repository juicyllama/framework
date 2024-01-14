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
- [Sync Orders](https://github.com/juicyllama/framework/blob/main/apps/shopify/src/modules/orders/orders.service.ts#L98){:target="_blank"}
- [addOrUpdateOrder](https://github.com/juicyllama/framework/blob/main/apps/shopify/src/modules/orders/orders.service.ts#L130){:target="_blank"}

### Controller

- [Sync](https://github.com/juicyllama/framework/blob/main/apps/shopify/src/modules/orders/orders.controller.ts#L26){:target="_blank"}
- [List](https://github.com/juicyllama/framework/blob/main/apps/shopify/src/modules/orders/orders.controller.ts#L66){:target="_blank"}

### Crons

- Sync Orders (`CRON_APP_SHOPIFY_SYNC_ORDERS`) - [Code](https://github.com/juicyllama/framework/blob/main/apps/shopify/src/modules/orders/orders.cron.service.ts#L27){:target="_blank"}

### Webhooks

- `app/shopify/orders/webhook` - [Code](https://github.com/juicyllama/framework/blob/main/apps/shopify/src/modules/orders/orders.controller.ts#L105){:target="_blank"}