# Orders

Import the module into your project:

```typescript
// app.module.ts
import { ShopifyOrdersModule } from '@juicyllama/app-shopify'

@Module({
	imports: [ShopifyOrdersModule],
})
export class AppModule {}
```

### Services

- List Orders
- Sync Orders
- addOrUpdateOrder

### Controller

- `app/shopify/orders/sync`
- `app/shopify/orders/list`

### Crons

- Sync Orders (`CRON_APP_SHOPIFY_SYNC_ORDERS`)

### Webhooks

- `app/shopify/orders/webhook`